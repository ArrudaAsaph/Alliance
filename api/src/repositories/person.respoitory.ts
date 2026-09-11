import type { Repository } from "typeorm";
import { Person } from "../models/person.model";
import { AppDataSource } from "../configs/data-base";



export default class PersonRepository {
    private personRepository: Repository<Person>

    constructor () {
        this.personRepository = AppDataSource.getRepository(Person);
    }

    async create(person: Partial<Person>): Promise<Person> {
        const newPerson = this.personRepository.create(person)
        return await this.personRepository.save(newPerson)
    }

}
