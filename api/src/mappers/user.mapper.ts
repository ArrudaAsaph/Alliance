import { User } from "../models/user.model";
import type { CreateUserDTO, UserResponseDTO, UserSimpleResponseDTO } from "../dtos/user.dto";
import PersonMapper from "./person.mapper";


export class UserMapper {
    static toEntity(dto: CreateUserDTO): User {
        const user = new User();
        user.username = dto.username;
        user.email = dto.email;
        user.password = dto.password;

        return user;
    }


    static toResponse(user: User):UserResponseDTO  {
        const person = user.person;
        const userResponse: UserResponseDTO =  {
            id: user.id,
            username: user.username,
            email: user.email,
            updateAt: user.updatedAt,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            person: PersonMapper.toSimpleResponse(person)
        }

        if (user.isAdmin) {
            userResponse.admin = true;
        }

        return userResponse;

    }

   static toSimpleResponse(user: User): UserSimpleResponseDTO {
        const userResponse: UserSimpleResponseDTO = {
            id: user.id,
            username: user.username,
            email: user.email,
            lastLogin: user.lastLogin,
        };
        if (user.isAdmin) {
            userResponse.admin = true;
        }

        return userResponse;
    }

    static toSimpleResponseList(users: User[]): UserSimpleResponseDTO[] {
        return users.map(this.toSimpleResponse);
    }

    static toResponseList(users: User[]): UserResponseDTO[] {
        return users.map(this.toResponse);
    }
}
