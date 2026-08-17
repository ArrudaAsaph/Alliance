import type { UserInterface } from "../interfaces/user.interface";


export interface CreateUserDTO extends UserInterface {
    confirmPassword: string
}

export interface UserResponseDTO {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updateAt: Date | null;
    lastLogin: Date | null;
}