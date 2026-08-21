import type { UserInterface } from "../interfaces/user.interface";
import type { PersonSimpleResponseDTO } from "./person.dto";


export interface CreateUserDTO extends UserInterface {
    confirmPassword: string
}

export interface UpdateUserDTO {
    username?: string;
    email?: string;
}

export interface UserResponseDTO {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    admin?: true,
    updateAt: Date | null;
    lastLogin: Date | null;
    person: PersonSimpleResponseDTO,
}

export interface UserSimpleResponseDTO {
    id: string;
    username: string;
    email: string;
    admin?: true,
    lastLogin: Date | null;
}
