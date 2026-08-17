import type { NextFunction, Request, Response } from "express";
import PersonService from "../services/person.service";
import { PersonMapper } from "../mappers/person.mapper";
import type { UpdatePersonDTO, FindPersonFilters } from "../interfaces/person.interface";
import DateUtils from "../utils/data.util";



export default class PersonController {
    static async getById(req: Request, res: Response, next: NextFunction): Promise<void>  {
        try {
            let { id } = req.params
            const person = PersonMapper.toResponseDTO(await PersonService.getById(id as string,req.user!))
            res.status(200).json ({
                success: true,
                ...person
            })
        } catch (error) {
            next(error)
        }
    }
    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as Record<string, string | undefined>;

            const filters: FindPersonFilters = {
                id: query.id,
                firstName: query.firstName,
                lastName: query.lastName,

                createdAtFrom: DateUtils.parseLocalDate(query.createdAtFrom),
                createdAtTo: DateUtils.parseLocalDate(query.createdAtTo),

                updatedAtFrom: DateUtils.parseLocalDate(query.updatedAtFrom),
                updatedAtTo: DateUtils.parseLocalDate(query.updatedAtTo),

                birthdayFrom: DateUtils.parseLocalDate(query.birthdayFrom),
                birthdayTo: DateUtils.parseLocalDate(query.birthdayTo),
            };

            const persons = PersonMapper.toSimpleResponseDTOList(await PersonService.findAll(filters, req.user!))

            res.status(200).json ({
                success: true,
                ...persons
            })

        } catch (error) {
            next(error);
        }
    }

    static async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const currentPerson = await PersonService.getMeByMyUser(req.user!.id);
            const changes = PersonMapper.toUpdateEntity(req.body as UpdatePersonDTO);
            const person = PersonMapper.toResponseDTO(await PersonService.update(currentPerson, changes));
            res.status(200).json({ success: true, ...person });
        } catch (error) {
            next(error);
        }
    }

    static async deleteMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await PersonService.delete(await PersonService.getMeByMyUser(req.user!.id));
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}
