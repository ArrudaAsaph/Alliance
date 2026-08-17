import type { NextFunction, Request, Response } from "express";
import PersonService from "../services/person.service";
import { PersonMapper } from "../mappers/person.mapper";
import type { UpdatePersonDTO } from "../interfaces/person.interface";
import GroupService from "../services/group.service";
import { GroupMapper } from "../mappers/group.mapper";
import type { FindGroupFilters } from "../interfaces/group.interface";
import DateUtils from "../utils/data.util";
import type { GroupType } from "../@types/group/group.type";

export default class GroupController {
    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {familyId} = req.params
            
            const group = await GroupService.create(
                GroupMapper.toEntity(req.body),
                req.user!,
                familyId as string
            );
            res.status(201).json({
                success: true,
                ...GroupMapper.toResponse(group),
            });
        } catch (error) {
            next(error);
        }
    }

    static async getMyGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as Record<string, string | undefined>;
            const filters: FindGroupFilters = {
                id: query.id,
                name: query.name,
                typeGroup: query.typeGroup as GroupType,
                personId: query.personId,
            };
            let group = await GroupService.findMyGroups(filters,req.user!)
            let b = GroupMapper.toResponseList(group)
            console.log(group,b)
            console.log(b)
            res.status(200).json({
                success: true,
                ...GroupMapper.toResponseList(group)
            })
        } catch (error) {

        }
    }
}
