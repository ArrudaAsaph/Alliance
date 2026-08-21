import type { Person } from '../models/person.model';
import type { User } from '../models/user.model';
import PersonRepository from '../repositories/person.respoitory';


export class PersonService {
    constructor(
        private readonly personRepository: PersonRepository
    ){}

    async create(user: User, person: Person): Promise<Person> {
        person.validateForCreate();
        person.user = user;
        person.updatedAt = null;
        return this.personRepository.create(person)
    }
}

export default new PersonService(new PersonRepository());
