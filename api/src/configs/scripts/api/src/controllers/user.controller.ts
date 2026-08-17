import type { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import RegistrationService from "../services/registration.service";
import { UserMapper } from "../mappers/user.mapper";
import type { CreateRegistrationDTO, FindUserFilters, UpdateUserDTO } from "../interfaces/user.interface";
import { PersonMapper } from "../mappers/person.mapper";
import DateUtils from "../utils/data.util";


export default class UserController {

    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload = req.body as CreateRegistrationDTO;

            const newUser = await RegistrationService.create(
                UserMapper.toEntity(payload),
                PersonMapper.toEntity(payload.person),
                payload.confirmPassword,
            );
            const ret = UserMapper.toResponseDTO(newUser)
            res.status(201).json({
                success: true,
                ...ret
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as Record<string, string | undefined>;
            const filters: FindUserFilters = {
                username: query.username,
                email: query.email,
                createdAtFrom: DateUtils.parseLocalDate(query.createdAtFrom),
                createdAtTo: DateUtils.parseLocalDate(query.createdAtTo),
                updatedAtFrom: DateUtils.parseLocalDate(query.updatedAtFrom),
                updatedAtTo: DateUtils.parseLocalDate(query.updatedAtTo),
                lastLoginFrom: DateUtils.parseLocalDate(query.lastLoginFrom),
                lastLoginTo: DateUtils.parseLocalDate(query.lastLoginTo),
                isAdmin:
                    query.isAdmin !== undefined
                        ? query.isAdmin === "true"
                        : undefined,
            };
            const users = UserMapper.toSimpleResponseDTOList(await UserService.findAll(filters, req.user!))

            res.status(200).json ({
                success: true,
                ...users
            })
        } catch(error) {
            next(error)
        }
    }

    static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const ret = UserMapper.toResponseDTO(req.user!);

            res.status(200).json({
                success: true,
                ...ret
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const user = await UserService.getById(id)
            const ret = UserMapper.toResponseDTO(user)
            res.status(200).json({
                success: true,
                ...ret
            });

        } catch (error) {
            next(error);
        }
    }

    static async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload = req.body as UpdateUserDTO;
            const user = await UserService.update(
                req.user!,
                UserMapper.toUpdateEntity(payload),
                payload.confirmPassword
            );
            res.status(200).json({ success: true, ...UserMapper.toResponseDTO(user) });
        } catch (error) {
            next(error);
        }
    }

    static async deleteMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await UserService.delete(req.user!);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
    
}
