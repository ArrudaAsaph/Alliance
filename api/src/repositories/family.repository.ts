import { Family } from "../models/family.model";
import { Repository } from "typeorm";
import { AppDataSource } from "../configs/data-base";
import type { FamilyFilters } from '../interfaces/family.interface';


export default class FamilyRepository {
    private familyRepository: Repository<Family>

    constructor () {
        this.familyRepository = AppDataSource.getRepository(Family);
    }

    async create(family: Family): Promise<Family> {
        const newfamily = this.familyRepository.create(family);
        return await this.familyRepository.save(newfamily);
    }

    async findMyFamilies(filters: FamilyFilters, id: string): Promise<Family[]> {
        const query = this.familyRepository
        .createQueryBuilder("family")
        .leftJoinAndSelect("family.createdBy", "createdBy")
        .leftJoin("family.members", "member")
        .distinct(true);
        
        console.log(filters)
        if (filters.id) {
            query.andWhere("family.id = :familyId", {
                familyId: filters.id,
            });
        }

        if (filters.name) {
            query.andWhere("family.name ILIKE :name", {
                name: `%${filters.name}%`,
            });
        }

        if (filters.createdByMe !== undefined) {

        if (filters.createdByMe) {
            // Somente famílias criadas por ele
            query.andWhere("createdBy.id = :personId", {
                personId: id,
            });

        } else {
            // Somente famílias NÃO criadas por ele
            query.andWhere("createdBy.id != :personId", {
                personId: id,
            });
        }
    }

       return query.getMany();
    }

}
