import { User } from "../models/user.model";
import { Person } from "../models/person.model";
import UserService, { UserService as UserServiceClass } from "./user.service";
import PersonService, { PersonService as PersonServiceClass }from "./person.service";


export class RegistrationService {
    constructor(
        private readonly userService: UserServiceClass,
        private readonly personService: PersonServiceClass
    ) {}
    async create(user: User, person: Person,confirmPassword: string): Promise<User> {
        user.validateForCreate();
        person.validateForCreate();
        const newUser = await this.userService.create(user, confirmPassword);
        const newPerson = await this.personService.create(newUser, person);
        newUser.person = newPerson;
        return newUser;
    }
}

export default new RegistrationService(UserService,PersonService);
