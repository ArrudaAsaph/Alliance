import { User } from "../models/user.model";
import UserRepository from "../repositories/user.repository";
import SecurityService from "./security.service";
import { AppError } from "../errors/error";
import { Validator } from "../utils/validator.utils";
import type { UpdateUserDTO } from "../dtos/user.dto";

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

    async findById(id: string): Promise<User> {
        this.validateId(id);
        const findUser = await this.userRepository.findById(id);
        if (!findUser) {
            AppError.notFound(
                this.entity, 
                "getById", 
                `Usuário de id ${id} não encontrado`, 
                );
        }
        return findUser;
    }

    async findAll(user: User): Promise<User[]> {
        this.securityService.needBeAdmin(user, 'user', 'findAll')
        const users = await this.userRepository.findAll();
        if (users.length == 0) {
            AppError.internal('user', 'findAll')
        }

        return users;
    }

    async update(user: User, changes: UpdateUserDTO): Promise<User> {
        if (Object.prototype.hasOwnProperty.call(changes, "password")) {
            AppError.badRequest(
                this.entity,
                "update",
                "A senha não pode ser alterada por este endpoint."
            );
        }

        const hasUsername = changes.username !== undefined;
        const hasEmail = changes.email !== undefined;
        
        if (!hasEmail && !hasUsername) {
            AppError.badRequest(
                this.entity,
                'update',
                'Informe ao menos um campo para atualizar.'
            )
        }

        if (hasEmail && changes.email === user.email) {
            AppError.conflict(
                this.entity,
                'update',
                `Informe um email diferente do atual.`,
                `${changes.email}`
            )
        }

        if (hasUsername && changes.username === user.username) {
            AppError.conflict(
                this.entity,
                'update',
                `Informe um username diferente do atual.`,
                `${changes.username}`
            )
        }

        if (hasUsername) user.username = changes.username!;
        if (hasEmail) user.email = changes.email!;

        user.validateForUpdate();
        if (hasUsername) await this.assertUsernameAvailable(user.username, 'update', user.id);
        if (hasEmail) await this.assertEmailAvailable(user.email, 'update', user.id);

        return await this.userRepository.update(user)
    }

    async delete(user: User, password: string): Promise<void> {
        const findUser = await this.findById(user.id);

        const isOnlyUser = this.securityService.verify(password, findUser.password);

        if (!isOnlyUser) {
            AppError.unauthorized(
                'user',
                'delete',
                'Usuário não encontrado ou senha inválida.'
            );
        }

        await this.userRepository.delete(user.id);
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

    private validateId(id: string | null | undefined): void {
        const error = Validator.required(id, "id");
        if (error) AppError.badRequest(this.entity, "getById", "campos inválidos");
        if (!Validator.isUUUID(id)) {
            AppError.badRequest(
                this.entity, 
                "getById", 
                "ID inválido.", 
            );
        }
    }
}

export default new UserService();
