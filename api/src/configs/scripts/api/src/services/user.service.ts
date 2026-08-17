import UserRepository from "../repositories/user.repositories";
import { User } from "../models/user.models";
import { AppError } from "../models/error.model";
import { Validator } from "../utils/validator.utils";
import SecurityService from "./security.service";
import type { FindUserFilters } from "../interfaces/user.interface";

export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly securityService: SecurityService
    ) {}

    async create(user: User, confirmPassword: string): Promise<User> {
        user.validateForCreate();
        await this.assertEmailAvailable(user.email);
        await this.assertUsernameAvailable(user.username);
        this.assertPasswordConfirmation(user.password, confirmPassword, "create");

        user.password = await this.securityService.hash(user.password);
        user.lastLogin = null;
        user.updatedAt = null;
        return this.userRepository.create(user);
    }

    async update(user: User, changes: User, confirmPassword?: string): Promise<User> {
        const hasUsername = changes.username !== undefined;
        const hasEmail = changes.email !== undefined;
        const hasPassword = changes.password !== undefined;
        if (!hasUsername && !hasEmail && !hasPassword) {
            throw new AppError(
                "user", 
                "update", 
                "Informe ao menos um campo para atualizar.", 
                400
            );
        }

        const updated = Object.assign(user, {
            ...(hasUsername ? { username: changes.username } : {}),
            ...(hasEmail ? { email: changes.email } : {}),
        });
        
        updated.validateForUpdate();

        if (hasUsername) await this.assertUsernameAvailable(updated.username, updated.id);
        if (hasEmail) await this.assertEmailAvailable(updated.email, updated.id);

        const payload: Partial<User> = {};
        if (hasUsername) payload.username = updated.username;
        if (hasEmail) payload.email = updated.email;
        if (hasPassword) {
            changes.validatePasswordChange();
            this.assertPasswordConfirmation(changes.password, confirmPassword, "update");
            payload.password = await this.securityService.hash(changes.password);
        }

        return this.userRepository.update(updated.id, payload);
    }

    async findAll(filters: FindUserFilters, user: User): Promise<User[]> {
        // permissao de admin
        this.securityService.needBeAdmin(user, "user", "findAll")

        const users = await this.userRepository.findAll(filters)

        if (users.length === 0) {
            AppError.notFound(
                "user",
                "getAll",
                "nenhum usuário encontrado",
            )
        }

        return users
    }

    async delete(user: User): Promise<void> {
        await this.userRepository.delete(user.id);
    }

    async getById(id: string | null | undefined): Promise<User> {
        this.validateId(id);
        const user = await this.userRepository.findById(id as string);
        if (!user) {
            AppError.notFound(
                "user", 
                "getById", 
                `Usuário de id ${id} não encontrado`, 
                );
            }
        return user;
    }

    private async assertEmailAvailable(email: string, currentId?: string): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser && existingUser.id !== currentId) {
            AppError.conflict(
                "user", 
                "create", 
                "Email já cadastrado", 
            );
        }
    }

    private async assertUsernameAvailable(username: string, currentId?: string): Promise<void> {
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser && existingUser.id !== currentId) {
            AppError.conflict(
                "user", 
                "create", 
                "Username já cadastrado"
            );
        }
    }

    private assertPasswordConfirmation(password: string, confirmPassword: string | undefined, action: "create" | "update"): void {
        if (password !== confirmPassword) {
            AppError.badRequest(
                "user", 
                action, 
                "As senhas não coincidem"
            );
        }
    }

    private validateId(id: string | null | undefined): void {
        const error = Validator.required(id, "id");
        if (error) AppError.badRequest("user", "getById", "campos inválidos");
        if (!Validator.isUUUID(id)) {
            AppError.badRequest(
                "user", 
                "getById", 
                "ID inválido.", 
            );
        }
    }
}

export default new UserService(new UserRepository(), new SecurityService());
