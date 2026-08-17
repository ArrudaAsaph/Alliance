
import { User } from "../models/user.models";
import type { UserResponseDTO, CreateUserDTO, UpdateUserDTO, UserSimpleResponseDTO } from "../interfaces/user.interface";
import type { PersonSimpleResponseDTO } from "../interfaces/person.interface";
import type { AuthUserInternal } from "../interfaces/auth.interface";

export class UserMapper {
        static toEntity(dto: CreateUserDTO): User {
            const user = new User();

            user.username = dto.username;
            user.email = dto.email;
            user.password = dto.password;

            return user;
        }

        static toEntityInternal(dto: AuthUserInternal): User {
            const user = new User()
            user.id = dto.id
            user.username = dto.username
            user.email = dto.email
            return user
        }

        static toUpdateEntity(dto: UpdateUserDTO): User {
            const user = new User();

            if (dto.username !== undefined) user.username = dto.username;
            if (dto.email !== undefined) user.email = dto.email;
            if (dto.password !== undefined) user.password = dto.password;

            return user;
        }

        static toResponseDTO(user: User): UserResponseDTO {
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
                person: user.person ? {
                    id: user.person.id,
                    firstName: user.person.firstName,
                    lastName: user.person.lastName,
                    birthday: user.person.birthday ?? null,
                    createdAt: user.person.createdAt,
                    updatedAt: user.person.updatedAt ?? null,
                } : null
            };
        }

        static toSimpleResponseDTO(user: User): UserSimpleResponseDTO {
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
            };
        }



        static toSimpleResponseDTOList(users: User[]): UserSimpleResponseDTO[] {
            return users.map(this.toSimpleResponseDTO)
        }
}
