import { User } from "../models/user.models";
import { Person } from "../models/person.model";
import UserService, { UserService as UserServiceClass } from "./user.service";
import PersonService, { PersonService as PersonServiceClass } from "./person.service";

/** Caso de uso que coordena a única operação composta: cadastro + perfil. */
export class RegistrationService {
    constructor(
        private readonly userService: UserServiceClass,
        private readonly personService: PersonServiceClass
    ) {}

    async create(user: User, person: Person, confirmPassword: string): Promise<User> {
        user.validateForCreate()
        person.validateForCreate()
        const newUser = await this.userService.create(user, confirmPassword);
        await this.personService.create(newUser, person);
        return await this.userService.getById(newUser.id);
    }
}

export default new RegistrationService(UserService, PersonService);
