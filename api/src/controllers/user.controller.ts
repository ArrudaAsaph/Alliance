import type { NextFunction, Request, Response } from "express";
import UserService  from "../services/user.service";
import { UserMapper } from '../mappers/user.mapper';
import type{ UserFilters } from '../interfaces/user.interface';
import DateUtils from "../utils/data.util";

export default class UserController {

    static async findUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let id = req.params.id ?? req.user.id;
            const user = await UserService.findUserById(req.user, id as string)
            const ret = UserMapper.toResponse(user);
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

    static async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as Record<string, string | undefined>;
            console.log(query)
            const filters: UserFilters = {
                id: query.id,
                simpleResponse: query.simpleResponse !== undefined
                        ? query.simpleResponse === "true"
                        : true,
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
            const users = await UserService.find(req.user, filters)
            let ret;
            if (!filters.simpleResponse) {
                ret = UserMapper.toResponseList(users);
            } else {
                ret = UserMapper.toSimpleResponseList(users);
            }

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
            let ret = {
                message: 'Usuário excluído com sucesso!'
            }
            res.status(200).json({
                success: true,
                ...ret
            });
        } catch (error) {
            next(error);
        }
    }

    static async makeUserAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const payload = req.body;
            const user = await UserService.makeUserAdmin(req.user, id as string, payload.password as string);
            let ret = UserMapper.toResponse(user);
            res.status(200).json({
                success: true,
                ...ret
            });
        } catch (error) {
            next(error);
        }
    }
}
