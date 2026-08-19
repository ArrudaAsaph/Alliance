import type { NextFunction, Request, Response } from "express";
import type{ CreateRegistrationDTO } from '../dtos/registration.dto';
import  RegistrationService  from '../services/registration.service';
import { UserMapper } from '../mappers/user.mapper';


export default class RegistrationController {

    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload = req.body as  CreateRegistrationDTO
            const newUser = await RegistrationService.create(
                UserMapper.toEntity(payload.user),
                payload.user.confirmPassword
            )
            const ret = UserMapper.toResponse(newUser)
            res.status(201).json({
                success: true,
                ...ret
            });
        } catch (error) {
            next(error)
        }
    }
}