import type { Repository, FindOptionsWhere,  } from "typeorm";
import  {  In } from "typeorm";
import { Group } from "../models/group.model";
import { AppDataSource } from "../config/data-base";
import type { GroupType } from "../@types/group/group.type";
import type { FindGroupFilters } from "../interfaces/group.interface";



export default class GroupRepository {
    private groupRepository: Repository<Group>

    constructor(){
        this.groupRepository = AppDataSource.getRepository(Group)
    }

    async create(group: Partial<Group>): Promise<Group> {
        const newGroup = this.groupRepository.create(group)
        return await this.groupRepository.save(newGroup)
    }

    async findById(id: string, ): Promise<Group | null> {
        return await this.groupRepository.findOne({
            where: {id}
        })
    }

    async findByType(type: GroupType, personId?: string, familyId?: string) :Promise<Group[]> {
        const where: FindOptionsWhere<Group> = {
            typeGroup: type,
        }

        if (personId){
            where.createdBy = {id: personId};
        }

        if (familyId) {
            where.family = {id: familyId}
        }

        return await this.groupRepository.find({
            where,
        })
    }

    async findByFilters(
        filters: FindGroupFilters
    ): Promise<Group[]> {
        console.log(filters)
        const where: FindOptionsWhere<Group>[] = [];

        const baseFilter: FindOptionsWhere<Group> = {};

        if (filters.typeGroup) {
            baseFilter.typeGroup = filters.typeGroup;
        }

        if (filters.name) {
            baseFilter.name = filters.name;
        }

        if (filters.personId && filters.familyId?.length) {
            where.push(
                {
                    ...baseFilter,
                    createdBy: {
                        id: filters.personId,
                    },
                },
                {
                    ...baseFilter,
                    family: {
                        id: In(filters.familyId),
                    },
                }
            );
        } else if (filters.personId) {
            where.push({
                ...baseFilter,
                createdBy: {
                    id: filters.personId,
                },
            });
        } else if (filters.familyId?.length) {
            where.push({
                ...baseFilter,
                family: {
                    id: In(filters.familyId),
                },
            });
        } else {
            where.push(baseFilter);
        }

        return this.groupRepository.find({
            where,
            relations: {
                createdBy: true,
                family: true,
            },
        });
    }

}
