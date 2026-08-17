import type { CreateGroupDTO, GroupResponseDTO, GroupSimpleResponseDTO } from "../interfaces/group.interface";
import { Group } from "../models/group.model";
import { PersonMapper } from "./person.mapper";
import { FamilyMapper } from "./family.mapper";



export class GroupMapper {
    static toEntity(dto: CreateGroupDTO): Group {
        const group = new Group
        group.name = dto.name
        group.typeGroup = dto.typeGroup
        return group
    }

    static toResponse(group: Group): GroupResponseDTO {
        let person = PersonMapper.toSimpleResponseDTO(group.createdBy)
        let haveFamily = group.family ?? null
        let family;
        if (haveFamily !== null) {
            family = FamilyMapper.toSimpleResponseDTO(haveFamily)
        }
        return {
            id: group.id,
            name: group.name,
            typeGroup: group.typeGroup,
            createdAt: group.createdAt,
            createdBy: person,
            family: family ?? null,
        }
    }

    static toSimpleResponse(group: Group): GroupSimpleResponseDTO {
        let person = PersonMapper.toSimpleResponseDTO(group.createdBy)
        let haveFamily = group.family ?? null
        let family;
        if (haveFamily !== null) {
            family = FamilyMapper.toSimpleResponseDTO(haveFamily)
        }
        return {
            id: group.id,
            name: group.name,
            typeGroup: group.typeGroup,
            createdBy: person,
            family: family ?? null,
        }
    }

    static toResponseList(groups: Group[]): GroupSimpleResponseDTO[] {
    return groups.map(group => GroupMapper.toSimpleResponse(group));
}
}
