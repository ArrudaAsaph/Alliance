import type { PersonSimpleResponseDTO } from "./person.dto";

export interface CreateFamilyDTO {
    name: string;
}

export interface FamilySimpleResponseDTO {
    id: string;
    name: string;
    createdBy: PersonSimpleResponseDTO;
}

export interface FamilyResponseDTO {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
    createdBy: PersonSimpleResponseDTO;
}

