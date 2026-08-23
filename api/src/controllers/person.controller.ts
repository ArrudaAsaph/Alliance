import type { NextFunction, Request, Response } from "express";
import PersonService from "../services/person.service";
import PersonMapper from "../mappers/person.mapper";
import type { PersonFilters, PersonInterface } from "../interfaces/person.interface";
import DateUtils from "../utils/data.util";
import type { UpdatePersonDTO } from "../dtos/person.dto";



export default class PersonController {
    
    static async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as Record<string, string | undefined>;

            const filters: PersonFilters = {
                id: query.id,
                firstName: query.firstName,
                lastName: query.lastName,
                

                createdAtFrom: DateUtils.parseLocalDate(query.createdAtFrom),
                createdAtTo: DateUtils.parseLocalDate(query.createdAtTo),

                updatedAtFrom: DateUtils.parseLocalDate(query.updatedAtFrom),
                updatedAtTo: DateUtils.parseLocalDate(query.updatedAtTo),

                birthdayFrom: DateUtils.parseLocalDate(query.birthdayFrom),
                birthdayTo: DateUtils.parseLocalDate(query.birthdayTo),

                simpleResponse: query.simpleResponse !== undefined
                        ? query.simpleResponse === "true"
                        : true,
            };

            const persons = await PersonService.find(req.user, filters)

            console.log(persons)
            let ret;
            if (!filters.simpleResponse) {
                ret = PersonMapper.toResponseList(persons)
            } else {
                ret = PersonMapper.toSimpleReponseList(persons)
            }
            console.log(ret)
            res.status(200).json ({
                success: true,
                ...ret
            })

        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let payload = req.body as PersonInterface;
            const person = await PersonService.update(req.user.person, PersonMapper.toEntity(payload));

            let ret = PersonMapper.toResponse(person);
            console.log(ret)

            res.status(200).json ({
                success: true,
                ...ret
            })

        } catch (error) {
            next(error);
        }
    }
}
