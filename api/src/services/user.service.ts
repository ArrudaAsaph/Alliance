import { User } from "../models/user.model";
import UserRepository from "../repositories/user.repository";
import SecurityService from "./security.service";
import { AppError } from "../errors/error";

export class UserService {
    readonly  entity: string = 'UserService'

    constructor(
        private readonly userRepository: UserRepository = new UserRepository(),
        private readonly securityService: SecurityService = new SecurityService()
    ){}

    async create(user: User, confirmPassword: string): Promise<User> {
        user.validateForCreate();
        await this.assertEmailAvailable(user.email, 'create')
        await this.assertUsernameAvailable(user.username, 'create')
        await this.assertPasswordConfirmation(user.password, confirmPassword, 'create')

        user.password =  await this.securityService.hash(user.password)
        user.lastLogin = null;
        user.updatedAt = null;
        return this.userRepository.create(user);
    }


    // =========================
    // VALIDATIONS 
    // =========================

    private async assertEmailAvailable(email: string, action: string, currentId?: string): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser && existingUser.id !== currentId) {
            AppError.conflict(
                this.entity, 
                action, 
                "Email já cadastrado", 
                email
            );
        }
    }

    private async assertUsernameAvailable(username: string, action: string, currentId?: string): Promise<void> {
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser && existingUser.id !== currentId) {
            AppError.conflict(
                this.entity, 
                action, 
                "Username já cadastrado"
            );
        }
    }

    private assertPasswordConfirmation(password: string, confirmPassword: string | undefined, action: "create" | "update"): void {
        if (password !== confirmPassword) {
            AppError.badRequest(
               this.entity, 
                action, 
                "As senhas não coincidem"
            );
        }
    }
}

export default new UserService();
