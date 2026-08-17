import test from "node:test";
import assert from "node:assert/strict";
import { AuthService } from "../../../services/auth.service";
import UserRepository from "../../../repositories/user.repositories";
import SecurityService from "../../../services/security.service";
import { User } from "../../../models/user.models";
import { AppError } from "../../../models/error.model";

const user = (): User => Object.assign(new User(), { id: "user-id", username: "ana", email: "ana@example.com", password: "hash", lastLogin: null });

test("AuthService.login atualiza lastLogin depois de validar a senha", async () => {
    let loginUpdatedFor: string | undefined;
    const repository = { findByEmail: async () => user(), findByUsername: async () => null, updateLogin: async (id: string) => { loginUpdatedFor = id; return user(); } };
    const security = { verify: async () => true, generateToken: () => "access", generateRefreshToken: () => "refresh" };
    const service = new AuthService(repository as unknown as UserRepository, security as unknown as SecurityService);
    const authenticated = await service.login({ username: "ana@example.com", password: "Senha123" });
    assert.equal(loginUpdatedFor, "user-id");
    assert.ok(authenticated.lastLogin instanceof Date);
});

test("AuthService.login não atualiza lastLogin com senha inválida", async () => {
    const repository = { findByUsername: async () => user(), updateLogin: async () => assert.fail("não deveria persistir") };
    const security = { verify: async () => false };
    const service = new AuthService(repository as unknown as UserRepository, security as unknown as SecurityService);
    await assert.rejects(() => service.login({ username: "ana", password: "Senha123" }), (error: unknown) => error instanceof AppError && error.code === 400);
});

test("AuthService.token gera payload mínimo, sem senha", () => {
    let payload: object | undefined;
    const security = { generateToken: (value: object) => { payload = value; return "access"; }, generateRefreshToken: () => "refresh" };
    const service = new AuthService({} as UserRepository, security as unknown as SecurityService);
    assert.deepEqual(service.token(user()), { access: "access", refresh: "refresh" });
    assert.deepEqual(payload, { id: "user-id", username: "ana", email: "ana@example.com" });
});
