import type { UserSimpleResponseDTO } from "./user.interface";

export interface CreatePersonDTO {
    firstName: string,
    lastName: string,
    birthday?: string
}
export interface UpdatePersonDTO {
    firstName?: string;
    lastName?: string;
    birthday?: string | null;
}

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
    createdAt: Date
    updatedAt: Date | null
    birthday: Date | string | null;
}

export interface FindPersonFilters {
    id?: string,
    firstName?: string ,
    lastName?: string,
    createdAtFrom?: Date;
    createdAtTo?: Date;

    updatedAtFrom?: Date;
    updatedAtTo?: Date;

    birthdayFrom?: Date;
    birthdayTo?: Date;
}