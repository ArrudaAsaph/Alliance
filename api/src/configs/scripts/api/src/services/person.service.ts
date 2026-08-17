import PersonRepository from "../repositories/person.repository";
import { User } from "../models/user.models";
import { Person } from "../models/person.model";
import { AppError } from "../models/error.model";
import type { FindPersonFilters } from '../interfaces/person.interface';
import SecurityService from "./security.service";
import { Validator } from "../utils/validator.utils";


export class PersonService {
    constructor(
        private readonly personRepository: PersonRepository,
        private readonly securityService: SecurityService
    ) {}

    async create(user: User, person: Person): Promise<Person> {
        person.validateForCreate();
        person.user = user;
        person.updatedAt = null;
        return this.personRepository.create(person);
    }

    async getMeByMyUser(userId: string): Promise<Person> {        
        const person = await this.personRepository.findByUserId(userId);
        if (!person) {
            AppError.notFound(
                "person",
                "getByUserId",
                "Perfil não encontrado"
            )
        }
        return person;
    }

    async getById(personId: string, user: User): Promise<Person> {
        this.securityService.needBeAdmin(user, "person", "getById")
        
        if (!Validator.isUUUID(personId)) {
            AppError.badRequest(
                "person", 
                "getById", 
                "ID inválido.", 
            );
        }

        const person = await this.personRepository.findById(personId)

        if (!person) {
            AppError.notFound(
                "user", 
                "getById", 
                `Pessoa de id ${personId} não encontrado`, 
                );
        }

        return person
        
    }

    async findAll(filters: FindPersonFilters, user: User,): Promise<Person[]> {
        const securtiry = new SecurityService
        securtiry.needBeAdmin(
            user,
            "person",
            "getAll"
        )

        const persons = await this.personRepository.findAll(filters)
        
        if (persons.length === 0) {
            AppError.notFound(
                "persons",
                "getAll",
                "nenhum usuário encontrado",
            )
        }

        return persons
    }

    async update(person: Person, changes: Person): Promise<Person> {
        const hasFirstName = changes.firstName !== undefined;
        const hasLastName = changes.lastName !== undefined;
        const hasBirthday = changes.birthday !== undefined;
        if (!hasFirstName && !hasLastName && !hasBirthday) {
            throw new AppError("person", "update", "Informe ao menos um campo para atualizar.", 400);
        }

        const updated = Object.assign(person, {
            ...(hasFirstName ? { firstName: changes.firstName } : {}),
            ...(hasLastName ? { lastName: changes.lastName } : {}),
            ...(hasBirthday ? { birthday: changes.birthday } : {}),
        });
        updated.validateForUpdate();

        const payload: Partial<Person> = {};
        if (hasFirstName) payload.firstName = updated.firstName;
        if (hasLastName) payload.lastName = updated.lastName;
        if (hasBirthday) payload.birthday = updated.birthday;
        return this.personRepository.update(updated.id, payload);
    }

    async delete(person: Person): Promise<void> {
        await this.personRepository.delete(person.id);
    }


}

export default new PersonService(new PersonRepository(), new SecurityService);
