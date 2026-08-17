
import { Person } from "../models/person.model";
import type { CreatePersonDTO, UpdatePersonDTO, PersonResponseDTO, PersonSimpleResponseDTO } from '../interfaces/person.interface';



export class PersonMapper {
    static toEntity(dto: CreatePersonDTO): Person {
            const person = new Person();

            person.firstName = dto.firstName
            person.lastName = dto.lastName
            person.birthday = dto.birthday ? new Date(`${dto.birthday}T00:00:00`) : null;

            return person;
        }

        static toUpdateEntity(dto: UpdatePersonDTO): Person {
            const person = new Person();

            if (dto.firstName !== undefined) person.firstName = dto.firstName;
            if (dto.lastName !== undefined) person.lastName = dto.lastName;
            if (dto.birthday !== undefined) {
                person.birthday = dto.birthday === null ? null : new Date(`${dto.birthday}T00:00:00`);
            }

            return person;
        }

        static toResponseDTO(person: Person): PersonResponseDTO {
            return {
                id: person.id,
                firstName: person.firstName,
                lastName: person.lastName,
                birthday: person.birthday ?? null,
                createdAt: person.createdAt,
                updatedAt: person.updatedAt ?? null,
                user: person.user ? {
                    id: person.user.id,
                    username: person.user.username,
                    email: person.user.email,
                    createdAt: person.user.createdAt,
                    lastLogin: person.user.lastLogin,
                } : null,
            };
        }

        static toSimpleResponseDTO(person: Person): PersonSimpleResponseDTO {
            return {
                id: person.id,
                firstName: person.firstName,
                lastName: person.lastName,
                birthday: person.birthday ?? null,
                createdAt: person.createdAt,
                updatedAt: person.updatedAt ?? null,
            };
        }

        static toSimpleResponseDTOList(persons: Person[]): PersonSimpleResponseDTO[] {
            return persons.map(this.toSimpleResponseDTO)
        }
}
