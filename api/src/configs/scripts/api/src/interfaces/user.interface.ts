import type { CreatePersonDTO, PersonSimpleResponseDTO } from "./person.interface";

export interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface CreateRegistrationDTO extends CreateUserDTO {
    person: CreatePersonDTO;
}

export interface UpdateUserDTO {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export interface UserResponseDTO {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    lastLogin: Date | null;
    person?: PersonSimpleResponseDTO | null;
}

export interface UserSimpleResponseDTO {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    lastLogin: Date | null;
}

export interface UserLoginRequest{
    username: string,
    password:string
    
}

export interface UserParams {
    id: string;
}

export interface FindUserFilters {
    id?: string,
    username?: string ,
    email?: string,
    createdAtFrom?: Date;
    createdAtTo?: Date;

    updatedAtFrom?: Date;
    updatedAtTo?: Date;

    lastLoginFrom?: Date;
    lastLoginTo?: Date;
    isAdmin?: boolean
}
