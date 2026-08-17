import { GroupType } from "../@types/group/group.type";
import type { Group } from "../models/group.model";
import type { FamilySimpleResponseDTO } from "./family.interface";
import type { PersonSimpleResponseDTO } from "./person.interface";

export interface FindGroupFilters {
    id?: string,
    typeGroup?: GroupType;
    personId?: string;
    familyId?: string[];
    name?: string;
}

export interface CreateGroupDTO {
    name: string,
    typeGroup: GroupType
}

export interface GroupResponseDTO {
    id: string,
    name: string,
    typeGroup: GroupType,
    createdAt: Date,
    createdBy: PersonSimpleResponseDTO,
    family: FamilySimpleResponseDTO | null
}

export interface GroupSimpleResponseDTO {
    id: string,
    name: string,
    typeGroup: GroupType,
    createdBy: PersonSimpleResponseDTO,
    family: FamilySimpleResponseDTO | null
}
