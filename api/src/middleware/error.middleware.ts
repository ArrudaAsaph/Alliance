import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/error";
import { AppErrorMapper } from "../mappers/error.mapper";
import {
    ANSI,
    color,
    extractStackFrame,
    formatTimestamp,
    shortPath,
    statusColor,
    stringifyId,
} from "../utils/terminal-logger";

type SerializableHeaders = Record<string, string | string[] | undefined>;

function sanitizeHeaders(headers: Request["headers"]): SerializableHeaders {
    const maskedKeys = new Set(["authorization", "cookie", "set-cookie"]);

    return Object.entries(headers).reduce<SerializableHeaders>((acc, [key, value]) => {
        acc[key] = maskedKeys.has(key.toLowerCase()) ? "[REDACTED]" : value;
        return acc;
    }, {});
}

function safeJson(value: unknown): unknown {
    if (value === undefined) {
        return undefined;
    }

    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return "[Unserializable]";
    }
}

function serializeError(error: unknown): Record<string, unknown> {
    if (error instanceof AppError) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
            entity: error.entity,
            action: error.action,
            code: error.code,
            date: error.date.toISOString(),
            data: safeJson(error.data),
            internal: safeJson(error.internal),
        };
    }

    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
    }

    return {
        name: "UnknownError",
        message: String(error),
        stack: undefined,
    };
}

function resolveActor(req: Request): string {
    const user = req.user;

    if (!user) {
        return "anonymous";
    }

    const id = stringifyId(user.id);
    const username = typeof user.username === "string" ? ` @${user.username}` : "";

    return `${id}${username}`;
}

function resolveErrorType(error: unknown): string {
    if (error instanceof AppError) return "APP";
    if (error instanceof Error) return "ERR";
    return "UNKNOWN";
}

function buildAuditLog(req: Request, error: unknown, requestId: string): Record<string, unknown> {
    return {
        timestamp: new Date().toISOString(),
        requestId,
        kind: error instanceof AppError ? "AppError" : "UnhandledError",
        method: req.method,
        originalUrl: req.originalUrl,
        path: req.path,
        ip: req.ip,
        params: safeJson(req.params),
        query: safeJson(req.query),
        body: safeJson(req.body),
        headers: sanitizeHeaders(req.headers),
        error: serializeError(error),
        user: safeJson(req.user),
    };
}

function printSection(title: string, content: string, titleColor = ANSI.cyan): void {
    console.error(`${color(title, titleColor + ANSI.bold)} ${content}`);
}

function formatErrorLocation(stack?: string): string {
    const frame = extractStackFrame(stack);

    if (!frame) {
        return color("unknown", ANSI.faint);
    }

    return color(frame, ANSI.yellow);
}

function formatErrorHeader(req: Request, error: unknown): string {
    const timestamp = color(formatTimestamp(), ANSI.faint);
    const label = color("ERR", ANSI.red + ANSI.bold);
    const method = color(req.method.padEnd(6), ANSI.cyan + ANSI.bold);
    const path = color(shortPath(req.originalUrl), ANSI.white);
    const requestId = color(req.requestId ?? "n/a", ANSI.gray);
    const actor = color(resolveActor(req), ANSI.magenta);
    const statusCode = error instanceof AppError ? error.code : 500;
    const status = color(String(statusCode), statusColor(statusCode) + ANSI.bold);
    const errorType = color(resolveErrorType(error), ANSI.red);

    return [
        timestamp,
        label,
        method,
        path,
        color(">", ANSI.faint),
        `status=${status}`,
        `type=${errorType}`,
        `user=${actor}`,
        `id=${requestId}`,
    ].join(" ");
}

export function auditErrorHandler(
    error: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const requestId = req.requestId ?? "n/a";
    const auditLog = buildAuditLog(req, error, requestId);
    const serializedError = auditLog.error as Record<string, unknown>;
    const errorMessage = typeof serializedError.message === "string" ? serializedError.message : "Erro desconhecido";
    const errorStack = typeof serializedError.stack === "string" ? serializedError.stack : undefined;
    const errorLocation = formatErrorLocation(errorStack);
    const header = formatErrorHeader(req, error);
    const actor = color(resolveActor(req), ANSI.magenta);
    const method = color(req.method, ANSI.cyan);
    const path = color(shortPath(req.originalUrl), ANSI.white);
    const requestIdLabel = color(requestId, ANSI.gray);
    const timestamp = color(formatTimestamp(), ANSI.faint);

    console.error(header);
    console.error(
        `${color("  ↳", ANSI.red)} ${color("message", ANSI.bold)} ${color(errorMessage, ANSI.white)}`
    );
    console.error(
        `${color("  ↳", ANSI.red)} ${color("where", ANSI.bold)} ${errorLocation}`
    );
    console.error(
        `${color("  ↳", ANSI.red)} ${color("request", ANSI.bold)} ${method} ${path} ${color("|", ANSI.faint)} ${timestamp} ${color("|", ANSI.faint)} user=${actor} ${color("|", ANSI.faint)} id=${requestIdLabel}`
    );

    if (error instanceof AppError) {
        console.error(
            `${color("  ↳", ANSI.red)} ${color("app", ANSI.bold)} entity=${color(error.entity, ANSI.yellow)} action=${color(error.action, ANSI.yellow)} code=${color(String(error.code), statusColor(error.code) + ANSI.bold)}`
        );
    }

    console.error(
        `${color("  ↳", ANSI.red)} ${color("audit", ANSI.bold)} ${color("payload abaixo", ANSI.faint)}`
    );
    console.error(JSON.stringify(auditLog, null, 2));

    if (error instanceof AppError) {
        const payload = AppErrorMapper.toResponseDTO(error);

        res.status(payload.code).json({
            success: false,
            requestId,
            ...payload,
        });
        return;
    }

    res.status(500).json({
        success: false,
        requestId,
        message: "Erro interno do servidor.",
        code: 500,
        data: {},
    });
}
