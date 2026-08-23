import { AppError } from '../errors/error';
import type { PersonFilters } from '../interfaces/person.interface';
import type { Person } from '../models/person.model';
import type { User } from '../models/user.model';
import PersonRepository from '../repositories/person.respoitory';
import SecurityService from './security.service';


export class PersonService {
    constructor(
        private readonly personRepository: PersonRepository,
        private readonly securityService: SecurityService
    ){}

    async create(user: User, person: Person): Promise<Person> {
        person.validateForCreate();
        person.user = user;
        person.updatedAt = null;
        return this.personRepository.create(person)
    }

    async find(user: User, filters: PersonFilters): Promise<Person[]> {
        this.securityService.needBeAdmin(user, 'person', 'find');

        const persons = await this.personRepository.find(filters);
        
        if (persons.length == 0){
            AppError.notFound('person', 'find', 'Pessoas não encontradas')

        }

        return persons;
    }

    async update(person: Person, changes: Person): Promise<Person> {
        const hasFirstName = changes.firstName !== undefined;
        const hasLastName = changes.lastName !== undefined;
        const hasBirthday = changes.birthday !== undefined;
        if (!hasFirstName && !hasLastName && !hasBirthday) {
            AppError.badRequest(
                "person", 
                "update", 
                "Informe ao menos um campo para atualizar.",
            );
        }


        const updated = Object.assign(person, {
            ...(hasFirstName ? { firstName: changes.firstName } : {}),
            ...(hasLastName ? { lastName: changes.lastName } : {}),
            ...(hasBirthday ? { birthday: changes.birthday } : {}),
        });
        
        const payload: Partial<Person> = {};
        if (hasFirstName) payload.firstName = updated.firstName;
        if (hasLastName) payload.lastName = updated.lastName;
        if (hasBirthday) payload.birthday = updated.birthday;
        const updatedPerson = await this.personRepository.update(updated.id, payload);

        if (!updatedPerson) {
            AppError.unprocessable(
                'person',
                'update',
                'Erro ao atualizar o personagem'
            )
        }

        return updatedPerson;
    }

   async delete(person: Person): Promise<void> {
        await this.personRepository.delete(person.id);
    }
}

export default new PersonService(new PersonRepository(), new SecurityService());
