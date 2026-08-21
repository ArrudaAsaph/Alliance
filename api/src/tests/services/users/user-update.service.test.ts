import test from "node:test";
import assert from "node:assert/strict";
import { User } from "../../../models/user.model";
import { AppError } from "../../../errors/error";
import { UserService } from "../../../services/user.service";
import UserRepository from "../../../repositories/user.repository";
import SecurityService from "../../../services/security.service";
import type { UpdateUserDTO } from "../../../dtos/user.dto";

function createValidUser(): User {
    const user = new User();

    user.id = "user-id";
    user.username = "asaph";
    user.email = "asaph@email.com";
    user.password = "12345678";

    return user;
}

function createUserService(overrides?: {
    userRepository?: Partial<UserRepository>;
    securityService?: Partial<SecurityService>;
}) {
    const userRepository = {
        findByEmail: async () => null,
        findByUsername: async () => null,
        update: async (user: User) => user,
        ...overrides?.userRepository,
    } as unknown as UserRepository;

    const securityService = {
        ...overrides?.securityService,
    } as unknown as SecurityService;

    const service = new UserService(userRepository, securityService);

    return { service, userRepository, securityService };
}

test("UserService.update: deve atualizar apenas username e email", async () => {
    const { service } = createUserService();
    const user = createValidUser();
    const changes: UpdateUserDTO = {
        username: "novo_username",
        email: "novo@email.com",
    };

    const result = await service.update(user, changes);

    assert.equal(result.username, "novo_username");
    assert.equal(result.email, "novo@email.com");
    assert.equal(result.password, "12345678");
});

test("UserService.update: deve rejeitar alteração de senha", async () => {
    const { service } = createUserService();
    const user = createValidUser();

    await assert.rejects(
        () => service.update(user, { password: "novaSenha123" } as any),
        AppError
    );
});

