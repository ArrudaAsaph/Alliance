const RESET = "\x1b[0m";

export const ANSI = {
    reset: RESET,
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    faint: "\x1b[90m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
};

export function color(text: string, code: string): string {
    return `${code}${text}${RESET}`;
}

export function stripAnsi(text: string): string {
    return text.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "");
}

export function formatTimestamp(date: Date = new Date()): string {
    const pad = (value: number, size = 2): string => String(value).padStart(size, "0");
    return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate()),
    ].join("-") + " " + [
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds()),
    ].join(":") + `.${pad(date.getMilliseconds(), 3)}`;
}

export function statusColor(statusCode: number): string {
    if (statusCode >= 500) return ANSI.red;
    if (statusCode >= 400) return ANSI.yellow;
    if (statusCode >= 300) return ANSI.cyan;
    return ANSI.green;
}

export function durationColor(durationMs: number): string {
    if (durationMs >= 1000) return ANSI.red;
    if (durationMs >= 300) return ANSI.yellow;
    return ANSI.magenta;
}

export function stringifyId(value: unknown): string {
    if (typeof value === "string" && value.trim()) return value;
    return "anonymous";
}

export function formatDuration(durationMs: number): string {
    if (durationMs < 1000) return `${durationMs}ms`;

    const seconds = (durationMs / 1000).toFixed(durationMs < 10000 ? 2 : 1);
    return `${seconds}s`;
}

export function shortPath(path: string, maxLength = 80): string {
    if (path.length <= maxLength) return path;
    return `…${path.slice(path.length - maxLength + 1)}`;
}

export function extractStackFrame(stack?: string): string | undefined {
    if (!stack) return undefined;

    const lines = stack.split("\n").map((line) => line.trim());
    const frame = lines.find((line) => line.startsWith("at "));
    return frame;
}

export function normalizeRoute(method: string, path: string): string {
    return `${method.toUpperCase()} ${path}`;
}
