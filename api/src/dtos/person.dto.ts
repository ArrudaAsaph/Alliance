import type { UserSimpleResponseDTO } from "./user.dto";

export interface PersonResponseDTO {
    id: string
    firstName: string;
    lastName: string;
    createdAt: Date
    updatedAt: Date | null
    birthday: Date | string | null;
    user: UserSimpleResponseDTO | null;
}

export interface PersonSimpleResponseDTO {
    id: string
    firstName: string;
    lastName: string;
    birthday: Date | string | null;
}