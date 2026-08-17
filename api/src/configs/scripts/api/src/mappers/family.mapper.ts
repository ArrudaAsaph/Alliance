
import { Family } from "../models/family.model";
import type { CreateFamilyDTO, FamilyResponseDTO, FamilySimpleResponseDTO } from "../interfaces/family.interface";
import { PersonMapper } from "./person.mapper";

export class FamilyMapper {
    static toEntity(dto: CreateFamilyDTO): Family {
        const family = new Family();

        family.name = dto.name;
        family.updatedAt = null;

        return family;
    }

    static toUpdateEntity(dto: Partial<CreateFamilyDTO>): Family {
        const family = new Family();
        if (dto.name !== undefined) family.name = dto.name;
        return family;
    }

    static toResponseDTO(family: Family): FamilyResponseDTO {
        return {
            id: family.id,
            name: family.name,
            createdAt: family.createdAt,
            updatedAt: family.updatedAt ?? null,
            createdBy: PersonMapper.toSimpleResponseDTO(family.createdBy),
            members: (family.members ?? []).map((member) => ({
                id: member.id,
                firstName: member.firstName,
                lastName: member.lastName,
            })),
        };
    }

    static toSimpleResponseDTO(family: Family): FamilySimpleResponseDTO {
        return {
            id: family.id,
            name: family.name,
            createdAt: family.createdAt,
            updatedAt: family.updatedAt ?? null,
        };
    }

    static toSimpleResponseDTOList(families: Family[]): FamilySimpleResponseDTO[] {
        return families.map(this.toSimpleResponseDTO);
    }
}
