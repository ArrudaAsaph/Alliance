import type { NextFunction, Request, Response } from "express";
import { UserMapper } from "../mappers/user.mapper";
import authService from "../services/auth.service";
import type { AuthReponse } from "../interfaces/auth.interface";

export default class AuthController {

    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authenticatedUser = await authService.login(req.body);
            const user = UserMapper.toResponseDTO(authenticatedUser);
            const token: AuthReponse = authService.token(authenticatedUser);

            res.status(200).json({
                success: true,
                ...user,
                ...token
            });
        } catch (error) {
            next(error);
        }
    }

}
