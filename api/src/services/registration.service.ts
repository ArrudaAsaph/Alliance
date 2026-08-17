import { User } from "../models/user.model";
import UserService, { UserService as UserServiceClass } from "./user.service";


export class RegistrationService {
    constructor(
        private readonly userService: UserServiceClass
    ) {}
    async create(user: User, confirmPassword: string): Promise<User> {
        user.validateForCreate();
        const newUser = await this.userService.create(user, confirmPassword);
        return newUser;
    }
}

export default new RegistrationService(UserService);
