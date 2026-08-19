import type { NextFunction, Request, Response } from "express";
import UserService  from "../services/user.service";
import { UserMapper } from '../mappers/user.mapper';


export default class UserController {

    static async findMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const ret = UserMapper.toResponse(req.user!);
            res.status(201).json({
                success: true,
                ...ret
            });
        } catch (error) {
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload = req.body;
            const updatedUser = await UserService.update(req.user!, payload);
            const ret = UserMapper.toResponse(updatedUser);

            res.status(200).json({
                success: true,
                ...ret
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload = req.body
            await UserService.delete(req.user!, payload.password)
        } catch (error) {
            next(error);
        }
    }
}
