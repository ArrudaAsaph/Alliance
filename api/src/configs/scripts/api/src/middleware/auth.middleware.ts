import type { Request, Response, NextFunction } from "express";
import SecurityService from "../services/security.service";
import UserService from "../services/user.service";

const securityService = new SecurityService();

export default class AuthMiddleware {
    static async authenticate(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            res.sendStatus(401);
            return;
        }

        const token = authHeader.substring(7);

        try {
            const verifiedPayload = securityService.verifyToken(token);

            if (typeof verifiedPayload === 'string' || verifiedPayload === null || typeof verifiedPayload !== 'object') {
                res.sendStatus(401);
                return;
            }

            if (
                typeof verifiedPayload.id !== "string" ||
                typeof verifiedPayload.username !== "string" ||
                typeof verifiedPayload.email !== "string"
            ) {
                res.sendStatus(401);
                return;
            }

            req.user = await UserService.getById(verifiedPayload.id);

            next();
        } catch {
            res.sendStatus(401);
        }
    }
}
