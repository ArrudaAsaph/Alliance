import type { NextFunction, Request, Response } from "express";
import type { CreateFamilyDTO } from "../dtos/family.dto";
import FamilyService from "../services/family.service";
import { FamilyMapper } from "../mappers/family.mapper";
import type { FamilyFilters } from "../interfaces/family.interface";
import DateUtils from "../utils/data.util";


export default class FamilyController {

    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload = req.body as CreateFamilyDTO;
            const family = await FamilyService.create(req.user, FamilyMapper.toEntity(payload))
            let ret = FamilyMapper.toResponse(family);
            res.status(201).json({
                success: true,
                ...ret
            });
        } catch (error) {
            next(error);
        }
    }

    static async findMyFamilies(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as Record<string, string | undefined>;
                        console.log(query)
                        const filters: FamilyFilters = {
                            id: query.id,
                            name: query.name,
                            simpleResponse: query.simpleResponse !== undefined
                                    ? query.simpleResponse === "true"
                                    : true,
                            createdByMe: query.createdByMe !== undefined
                                    ? query.createdByMe === "true"
                                    : undefined,
                            memberName: query.memberName,
                            createdAtFrom: DateUtils.parseLocalDate(query.createdAtFrom),
                            createdAtTo: DateUtils.parseLocalDate(query.createdAtTo),
                            updatedAtFrom: DateUtils.parseLocalDate(query.updatedAtFrom),
                            updatedAtTo: DateUtils.parseLocalDate(query.updatedAtTo),
                        };
            const families = await FamilyService.findMyFamilies(req.user, filters);
            let ret;
            if (!filters.simpleResponse) {
                ret = FamilyMapper.toResponseList(families);
            } else {
                ret = FamilyMapper.toSimpleResponseList(families);
            }
            res.status(200).json({
                success: true,
                ...ret
            });
        } catch (error) {
            next(error);
        }
    }
}
