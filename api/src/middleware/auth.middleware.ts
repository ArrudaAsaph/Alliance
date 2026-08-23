import type { Request, Response, NextFunction } from "express";
import SecurityService from "../services/security.service";
import { AppError } from "../errors/error";
import  UserService from '../services/user.service';
const securityService = new SecurityService();


export default class AuthMiddleware {
    static async authenticate (req: Request, res: Response, next: NextFunction): Promise<void> {
        const authHeader = req.headers.authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            AppError.unauthorized(
                'user',
                'authenticate',
                'token não encontrado ou inválido'
            );
        }

        const token = authHeader.substring(7);

        try {
            const verifiedPayload = securityService.verifyToken(token);

            if (typeof verifiedPayload === 'string' || verifiedPayload === null || typeof verifiedPayload !== 'object') {
                AppError.unauthorized(
                    'user',
                    'authenticate',
                    'token não encontrado ou inválido'
                );
            }

            if (typeof verifiedPayload.id !== "string" || typeof verifiedPayload.username !== "string" || typeof verifiedPayload.email !== "string") {
                AppError.unauthorized(
                    'user',
                    'authenticate',
                    'token não encontrado ou inválido'
                );
            }

            const user = await UserService.findById(verifiedPayload.id);
            if (!user) {
                AppError.unauthorized(
                    'user',
                    'authenticate',
                    'token não encontrado ou inválido'
                );
            }
            req.user = user;
            next();
        } catch(error) {
            const jwtError = error as { name?: string } | null;

            if (jwtError?.name === "TokenExpiredError") {
                AppError.unauthorized(
                    "user",
                    "authenticate",
                    "token expirado"
                );
            }

            if (jwtError?.name === "JsonWebTokenError" || jwtError?.name === "NotBeforeError") {
                AppError.unauthorized(
                    "user",
                    "authenticate",
                    "token inválido"
                );
            }

            next(error)
        }
    }
}
