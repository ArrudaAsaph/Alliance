import { AppError } from "../errors/error";
import type { Family } from "../models/family.model";
import type { User } from "../models/user.model";
import FamilyRepository from "../repositories/family.repository";
import { Person } from "../models/person.model";
import type { FamilyFilters } from "../interfaces/family.interface";



class FamilyService {
    constructor(
        private readonly familyRepository: FamilyRepository
    ){}

    async create(user: User, family: Family): Promise<Family> {
        user.requirePerson('family', 'create');
        const person = user.person;
        let members: Person[];

        family.validateForCreate();
        
        family.createdBy = person;
        family.members = [person];
        const newFamily = await this.familyRepository.create(family);
        return newFamily;
    }

    async findMyFamilies(user: User, filters: FamilyFilters): Promise<Family[]> {
        user.requirePerson('family', 'findMyFamilies');

        const families = await this.familyRepository.findMyFamilies(filters, user.person.id);
        const hasFilters = Object.values(filters).some(
            value => value !== undefined && value !== null && value !== ''
        );

        if (families.length == 0 && !hasFilters) {
            AppError.notFound(
                'family',
                'findMyFamilies',
                'Usuário não está em nenhuma família.'
            )
        }

        return families;
    }
}

export default new FamilyService(new FamilyRepository());
