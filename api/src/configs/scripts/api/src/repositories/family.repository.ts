import type { Repository } from "typeorm";
import { Family } from "../models/family.model";
import { AppDataSource } from "../config/data-base";
import { AppError } from "../models/error.model";
import type { FindFamilyFilters } from "../interfaces/family.interface";
import { Brackets } from "typeorm";

export default class FamilyRepository {
    private familyRepository: Repository<Family>

    constructor() {
        this.familyRepository = AppDataSource.getRepository(Family)
    }


    async create(family: Partial<Family>): Promise<Family> {
        const newFamily = this.familyRepository.create(family)
        return await this.familyRepository.save(newFamily)
    }

    async findById(id: string): Promise<Family | null> {
        return await this.familyRepository.findOne ({
            where: {
                id
            },
            relations: {
                createdBy: true,
                members: true
            }
        })
    }

    async findByCreator(personId: string) : Promise<Family[]> {
        return await this.familyRepository.find({
            where: {
                createdBy: {
                    id: personId
                }
            },
            relations: {
                createdBy: true,
                members: true
            }
        })
    }

    async myFamilies(personId: string): Promise<Family[]> {
        return this.familyRepository
            .createQueryBuilder("family")
            .innerJoinAndSelect("family.members", "person")
            .where("person.id = :personId", { personId })
            .getMany();
    }

    async findByFilters(filters: FindFamilyFilters): Promise<Family[]> {
        const qb = this.familyRepository
            .createQueryBuilder("family")
            .distinct(true)
            .leftJoinAndSelect("family.createdBy", "createdBy")
            .leftJoinAndSelect("family.members", "member")
            .leftJoin("family.members", "userMember")
            .leftJoin("family.members", "filteredMember");

        if (filters.id) {
            qb.andWhere("family.id = :id", {
                id: filters.id,
            });
        }

        if (filters.name) {
            qb.andWhere("family.name ILIKE :name", {
                name: `%${filters.name}%`,
            });
        }
        
        if (filters.userMemberId) {
            qb.andWhere("userMember.id = :userMemberId", {
                userMemberId: filters.userMemberId,
            });
        }

        
        if (filters.createdBy || filters.members?.length) {
            qb.andWhere(
                new Brackets((qb) => {
                    if (filters.createdBy) {
                        qb.where("createdBy.id = :createdBy", {
                            createdBy: filters.createdBy,
                        });
                    }

                    if (filters.members?.length) {
                        const condition =
                            "filteredMember.id IN (:...members)";

                        if (filters.createdBy) {
                            qb.orWhere(condition, {
                                members: filters.members,
                            });
                        } else {
                            qb.where(condition, {
                                members: filters.members,
                            });
                        }
                    }
                }),
            );
        }

        if (filters.createdAtFrom) {
            const from = new Date(filters.createdAtFrom);
            from.setHours(0, 0, 0, 0);

            qb.andWhere("family.createdAt >= :createdAtFrom", {
                createdAtFrom: from,
            });
        }

        if (filters.createdAtTo) {
            const to = new Date(filters.createdAtTo);
            to.setHours(23, 59, 59, 999);

            qb.andWhere("family.createdAt <= :createdAtTo", {
                createdAtTo: to,
            });
        }

        if (filters.updatedAtFrom) {
            const from = new Date(filters.updatedAtFrom);
            from.setHours(0, 0, 0, 0);

            qb.andWhere("family.updatedAt >= :updatedAtFrom", {
                updatedAtFrom: from,
            });
        }

        if (filters.updatedAtTo) {
            const to = new Date(filters.updatedAtTo);
            to.setHours(23, 59, 59, 999);

            qb.andWhere("family.updatedAt <= :updatedAtTo", {
                updatedAtTo: to,
            });
        }

        return qb.getMany();
    }

    async update(id: string, family: Partial<Family>): Promise<Family> {
        await this.familyRepository.update(id, { ...family, updatedAt: new Date() });
        const updatedFamily = await this.findById(id);
        if (!updatedFamily) throw new AppError("family", "update", "Família não encontrada", 404);
        return updatedFamily;
    }

    async addMember(familyId: string, personId: string): Promise<void> {
        await this.familyRepository.createQueryBuilder().relation(Family, "members").of(familyId).add(personId);
    }

    async removeMember(familyId: string, personId: string): Promise<void> {
        await this.familyRepository.createQueryBuilder().relation(Family, "members").of(familyId).remove(personId);
    }

    async delete(id: string): Promise<void> {
        await this.familyRepository.delete(id);
    }

    async personBelongsToFamily(familyId: string, personId: string): Promise<boolean> {
        const family = await this.familyRepository
            .createQueryBuilder("family")
            .innerJoin("family.members", "person", "person.id = :personId", { personId })
            .where("family.id = :familyId", { familyId })
            .getOne();

        return family !== null;
    }

}
