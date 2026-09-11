import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/error";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type Attempt = {
    count: number;
    resetAt: number;
};

const attemptsByIp = new Map<string, Attempt>();

export default class LoginRateLimitMiddleware {
    static limit(req: Request, _res: Response, next: NextFunction): void {
        const now = Date.now();
        const key = req.ip || "unknown";
        const current = attemptsByIp.get(key);

        if (!current || current.resetAt <= now) {
            attemptsByIp.set(key, { count: 1, resetAt: now + WINDOW_MS });
            next();
            return;
        }

        if (current.count >= MAX_ATTEMPTS) {
            next(new AppError(
                "auth",
                "login",
                "Muitas tentativas de login. Tente novamente mais tarde.",
                429
            ));
            return;
        }

        current.count += 1;
        next();
    }
}
