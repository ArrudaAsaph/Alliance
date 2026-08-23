import test from "node:test";
import assert from "node:assert/strict";
import { User } from "../../../models/user.model";
import { AppError } from "../../../errors/error";
import { UserService } from "../../../services/user.service";
import UserRepository from "../../../repositories/user.repository";
import SecurityService from "../../../services/security.service";

function createValidUser(): User {
    const user = new User();

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
        create: async (user: User) => user,
        ...overrides?.userRepository,
    } as unknown as UserRepository;

    const securityService = {
        hash: async (password: string) => `hashed:${password}`,
        ...overrides?.securityService,
    } as unknown as SecurityService;

    const service = new UserService(userRepository, securityService);

    return { service, userRepository, securityService };
}

test("UserService.create: deve criar um usuário válido", async () => {
    const { service } = createUserService();
    const user = createValidUser();

    const result = await service.create(user, "12345678");

    assert.equal(result.email, "asaph@email.com");
    assert.equal(result.password, "hashed:12345678");
    assert.equal(result.lastLogin, null);
    assert.equal(result.updatedAt, null);
});

test("UserService.create: deve lançar erro quando dados do usuário forem inválidos", async () => {
    const { service } = createUserService();
    const user = createValidUser();
    user.username = "";

    await assert.rejects(() => service.create(user, "12345678"), AppError);
});

test("UserService.create: deve lançar erro quando email já estiver cadastrado", async () => {
    const existingUser = createValidUser();
    existingUser.id = "outro-id";

    const { service } = createUserService({
        userRepository: {
            findByEmail: async () => existingUser,
        },
    });

    const user = createValidUser();

    await assert.rejects(() => service.create(user, "12345678"), AppError);
});

test("UserService.create: deve lançar erro quando username já estiver cadastrado", async () => {
    const existingUser = createValidUser();
    existingUser.id = "outro-id";

    const { service } = createUserService({
        userRepository: {
            findByEmail: async () => null,
            findByUsername: async () => existingUser,
        },
    });

    const user = createValidUser();

    await assert.rejects(() => service.create(user, "12345678"), AppError);
});

test("UserService.create: deve lançar erro quando confirmPassword não coincidir", async () => {
    const { service } = createUserService();
    const user = createValidUser();

    await assert.rejects(() => service.create(user, "senhaErrada"), AppError);
});

test("UserService.create: deve fazer o hash da senha antes de persistir", async () => {
    let hashCalledWith: string | undefined;

    const { service } = createUserService({
        securityService: {
            hash: async (password: string) => {
                hashCalledWith = password;
                return "senha-hasheada";
            },
        },
    });

    const user = createValidUser();
    const result = await service.create(user, "12345678");

    assert.equal(hashCalledWith, "12345678");
    assert.equal(result.password, "senha-hasheada");
});

test("UserService.create: deve chamar userRepository.create com o usuário final", async () => {
    let createCalledWith: User | undefined;

    const { service } = createUserService({
        userRepository: {
            create: async (user: User) => {
                createCalledWith = user;
                return user;
            },
        },
    });

    const user = createValidUser();
    await service.create(user, "12345678");

    assert.equal(createCalledWith?.username, "asaph");
    assert.equal(createCalledWith?.lastLogin, null);
    assert.equal(createCalledWith?.updatedAt, null);
});
