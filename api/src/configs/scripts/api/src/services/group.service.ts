import type { Group } from "../models/group.model";
import type { User } from "../models/user.models";
import { AppError } from "../models/error.model";
import GroupRepository from "../repositories/group.repository";
import type { FindGroupFilters } from "../interfaces/group.interface";
import FamilyService from "./family.service";


class GroupService {
    constructor(
        private readonly groupRepository: GroupRepository,
        private readonly familyService: typeof FamilyService
    ) {}

    async findMyGroups(filters: FindGroupFilters, user: User): Promise<Group[]> {
        const person = user.requirePerson('group', 'findMyGroups')
        const families = await this.familyService.findMyFamilies({}, user);
        if (families.length) {
            filters.familyId = families.map((family) => family.id)
        }
        if(!user.userIsAdmin()) {
            filters.personId = person.id
        }
        const groups = await this.groupRepository.findByFilters(filters);
        return groups
    }

    async create(group: Group, user: User, familyId?: string): Promise<Group> {
        group.validateForCreate();
        const person = user.requirePerson('group', 'create')
        
        group.createdBy = person;
   
        if (familyId) {
            const family = await this.familyService.findFamilyByPersonId(familyId, user);
            console.log(family)
            group.family = family;
        }
        
        return await this.groupRepository.create(group);
    }
}

export default new GroupService(new GroupRepository(), FamilyService);
