import type { FindOptionsWhere, Repository } from "typeorm";
import { Between, ILike } from "typeorm";
import { Person } from "../models/person.model";
import { AppDataSource } from "../config/data-base";
import { AppError } from "../models/error.model";
import type { FindPersonFilters } from "../interfaces/person.interface";


export default class PersonRepository {
    private personRepository: Repository<Person>

    constructor () {
        this.personRepository = AppDataSource.getRepository(Person);
    }

    async create(person: Partial<Person>): Promise<Person> {

        const newPerson = this.personRepository.create(person)
        return await this.personRepository.save(newPerson)
    }

    async findByUserId(userId: string): Promise <Person | null> {
        return await this.personRepository.findOne ({
            where: {
                user: {
                    id: userId
                }
            }
        })
    }


    async findById(id: string): Promise<Person | null> {
        return await this.personRepository.findOne({
            where: {id},
            relations: {
                user: true
            }
        })
    }

    async findAll(filters: FindPersonFilters): Promise<Person[]> {
        const where: FindOptionsWhere<Person> = {};

        if (filters.id) {
            where.id = ILike(`%${filters.id}%`);
        }

        if (filters.firstName) {
            where.firstName = ILike(`%${filters.firstName}%`);
        }

        if (filters.lastName) {
            where.lastName = ILike(`%${filters.lastName}%`);
        }

        if (filters.createdAtFrom || filters.createdAtTo) {
            where.createdAt = Between(
                filters.createdAtFrom ?? new Date("1900-01-01"),
                filters.createdAtTo ?? new Date("9999-12-31")
            );
        }

        if (filters.updatedAtFrom || filters.updatedAtTo) {
            where.updatedAt = Between(
                filters.updatedAtFrom ?? new Date("1900-01-01"),
                filters.updatedAtTo ?? new Date("9999-12-31")
            );
        }

        if (filters.birthdayFrom || filters.birthdayTo) {
            where.birthday = Between(
                filters.birthdayFrom ?? new Date("1900-01-01"),
                filters.birthdayTo ?? new Date("9999-12-31")
            );
        }

        return this.personRepository.find({
            where,
            relations: {
                user: true,
            },
        });
    }

    async update(id: string, person: Partial<Person>): Promise<Person> {
        await this.personRepository.update(id, { ...person, updatedAt: new Date() });
        const updatedPerson = await this.findById(id);
        if (!updatedPerson) throw new AppError(
            "person", 
            "update", 
            "Perfil não encontrado",
            404
        );
        return updatedPerson;
    }

    async delete(id: string): Promise<void> {
        await this.personRepository.delete(id);
    }

}
