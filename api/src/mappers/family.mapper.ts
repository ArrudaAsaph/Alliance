import type { CreateFamilyDTO, FamilyResponseDTO, FamilySimpleResponseDTO } from "../dtos/family.dto";
import { Family } from "../models/family.model";
import PersonMapper from "./person.mapper";


export class FamilyMapper {
    static toEntity(dto: CreateFamilyDTO): Family {
        const family = new Family;
        family.name = dto.name;
        return family;
    }

    static toSimpleResponse(family: Family): FamilySimpleResponseDTO {
        return {
            id: family.id,
            name: family.name,
            createdBy: PersonMapper.toSimpleResponse(family.createdBy)
        }
    }

    static toResponse(family: Family): FamilyResponseDTO {
        return {
            id: family.id,
            name: family.name,
            createdAt: family.createdAt,
            updatedAt: family.updatedAt ?? null,
            createdBy: PersonMapper.toSimpleResponse(family.createdBy)
        }
    }

    static toResponseList(families: Family[]): FamilyResponseDTO[] {
        return families.map(this.toResponse);
    }

    static toSimpleResponseList(families: Family[]): FamilySimpleResponseDTO[] {
        return families.map(this.toSimpleResponse);
    }
}