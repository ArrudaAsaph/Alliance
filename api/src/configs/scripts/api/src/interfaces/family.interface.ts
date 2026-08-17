import type { PersonSimpleResponseDTO } from "./person.interface";

export interface CreateFamilyDTO {
    name: string;
}

export interface FamilyMemberResponseDTO {
    id: string;
    firstName: string;
    lastName: string;
}

export interface FamilyResponseDTO {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
    createdBy: PersonSimpleResponseDTO;
    members: FamilyMemberResponseDTO[];
}

export interface FamilySimpleResponseDTO {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface FindFamilyFilters {
    id?: string;
    name?: string;

    createdAtFrom?: Date;
    createdAtTo?: Date;

    updatedAtFrom?: Date;
    updatedAtTo?: Date;

    createdBy?: string;

    members?: string[];
    userMemberId?: string;
}
