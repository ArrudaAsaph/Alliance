import { User } from "../models/user.model";
import type { CreateUserDTO, UserResponseDTO } from "../dtos/user.dto";


export class UserMapper {
    static toEntity(dto: CreateUserDTO): User {
        const user = new User();
        console.log(dto)
        user.username = dto.username;
        user.email = dto.email;
        user.password = dto.password;

        return user;
    }


    static toReponse(user: User):UserResponseDTO  {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            updateAt: user.updatedAt,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
        }

    }
}