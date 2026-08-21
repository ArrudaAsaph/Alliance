import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import {
    ANSI,
    color,
    durationColor,
    formatDuration,
    formatTimestamp,
    shortPath,
    statusColor,
    stringifyId,
} from "../utils/terminal-logger";

function resolveRequestId(req: Request): string {
    const incoming = req.headers["x-request-id"];

    if (typeof incoming === "string" && incoming.trim()) {
        return incoming.trim();
    }

    if (Array.isArray(incoming) && incoming[0]?.trim()) {
        return incoming[0].trim();
    }

    return randomUUID();
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

function resolveStatusLabel(statusCode: number): string {
    if (statusCode >= 500) return "FAIL";
    if (statusCode >= 400) return "WARN";
    if (statusCode >= 300) return "REDIR";
    return "OK";
}

function formatRequestLine(req: Request, res: Response, durationMs: number): string {
    const timestamp = color(formatTimestamp(), ANSI.faint);
    const label = color("REQ", ANSI.blue + ANSI.bold);
    const method = color(req.method.padEnd(6), ANSI.cyan + ANSI.bold);
    const path = color(shortPath(req.originalUrl), ANSI.white);
    const statusCode = res.statusCode;
    const status = color(String(statusCode), statusColor(statusCode) + ANSI.bold);
    const statusLabel = color(resolveStatusLabel(statusCode), statusColor(statusCode));
    const duration = color(formatDuration(durationMs), durationColor(durationMs));
    const actor = color(resolveActor(req), ANSI.magenta);
    const requestId = color(req.requestId ?? "n/a", ANSI.gray);

    return [
        timestamp,
        label,
        method,
        path,
        color(">", ANSI.faint),
        `status=${status}`,
        `(${statusLabel})`,
        `time=${duration}`,
        `user=${actor}`,
        `id=${requestId}`,
    ].join(" ");
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    const requestId = resolveRequestId(req);
    req.requestId = requestId;
    res.setHeader("x-request-id", requestId);

    const startedAt = process.hrtime.bigint();
    let logged = false;

    const logRequest = (event: "finish" | "close"): void => {
        if (logged) return;
        logged = true;

        const durationMs = Number((process.hrtime.bigint() - startedAt) / BigInt(1_000_000));
        const line = formatRequestLine(req, res, durationMs);

        if (event === "close" && !res.writableEnded) {
            console.log(`${line} ${color("(aborted)", ANSI.red)}`);
            return;
        }

        console.log(line);
    };

    res.once("finish", () => logRequest("finish"));
    res.once("close", () => logRequest("close"));

    next();
}
