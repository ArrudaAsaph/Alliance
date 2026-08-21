import type { PersonResponseDTO, PersonSimpleResponseDTO } from "../dtos/person.dto";
import type { PersonInterface } from "../interfaces/person.interface";
import { Person } from "../models/person.model";
import { UserMapper } from "./user.mapper";


export default class PersonMapper {
    static toEntity(dto: PersonInterface): Person {
        const person = new Person()
        person.firstName = dto.firstName;
        person.lastName = dto.lastName;
        person.birthday = dto.birthday;
        return person;
    }

    static toResponse(person: Person): PersonResponseDTO {
        const user = person.user
        return {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            birthday: person.birthday,
            createdAt: person.createdAt,
            updatedAt: person.updatedAt ?? null,
            user: UserMapper.toSimpleResponse(user)
        }
    }

    static toSimpleResponse(person: Person): PersonSimpleResponseDTO {
        return {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            birthday: person.birthday
        }
    }
}