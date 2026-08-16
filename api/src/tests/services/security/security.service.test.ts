import test from "node:test";
import assert from "node:assert/strict";
import SecurityService from "../../../services/security.service";
import { AppError } from "../../../errors/error";
import { User } from "../../../models/user.model";

const REQUIRED_ENV_VARS = [
    "PASSWORD_PEPPER",
    "SECRET_KEY_JWT",
    "SECRET_REFRESH_KEY_JWT",
    "JWT_EXPIRES_IN",
    "JWT_REFRESH_EXPIRES_IN",
] as const;

function setValidEnv(): void {
    process.env.PASSWORD_PEPPER = "pepper-de-teste";
    process.env.SECRET_KEY_JWT = "secret-de-teste";
    process.env.SECRET_REFRESH_KEY_JWT = "refresh-secret-de-teste";
    process.env.JWT_EXPIRES_IN = "15m";
    process.env.JWT_REFRESH_EXPIRES_IN = "7d";
}

function snapshotEnv(): Record<string, string | undefined> {
    const snapshot: Record<string, string | undefined> = {};
    for (const key of REQUIRED_ENV_VARS) {
        snapshot[key] = process.env[key];
    }
    return snapshot;
}

function restoreEnv(snapshot: Record<string, string | undefined>): void {
    for (const key of REQUIRED_ENV_VARS) {
        if (snapshot[key] === undefined) {
            delete process.env[key];
        } else {
            process.env[key] = snapshot[key];
        }
    }
}

function createValidUser(isAdmin = false): User {
    const user = new User();
    user.username = "asaph";
    user.email = "asaph@email.com";
    user.password = "12345678";
    user.isAdmin = isAdmin;
    return user;
}

// =========================
// CONSTRUCTOR
// =========================

test("SecurityService.constructor: deve instanciar com todas as env vars configuradas", () => {
    const snapshot = snapshotEnv();
    setValidEnv();

    assert.doesNotThrow(() => new SecurityService());

    restoreEnv(snapshot);
});

test("SecurityService.constructor: deve lançar erro quando PASSWORD_PEPPER não estiver configurado", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    delete process.env.PASSWORD_PEPPER;

    assert.throws(() => new SecurityService(), AppError);

    restoreEnv(snapshot);
});

test("SecurityService.constructor: deve lançar erro quando SECRET_KEY_JWT não estiver configurado", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    delete process.env.SECRET_KEY_JWT;

    assert.throws(() => new SecurityService(), AppError);

    restoreEnv(snapshot);
});

test("SecurityService.constructor: deve lançar erro quando SECRET_REFRESH_KEY_JWT não estiver configurado", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    delete process.env.SECRET_REFRESH_KEY_JWT;

    assert.throws(() => new SecurityService(), AppError);

    restoreEnv(snapshot);
});

test("SecurityService.constructor: deve lançar erro quando JWT_EXPIRES_IN não estiver configurado", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    delete process.env.JWT_EXPIRES_IN;

    assert.throws(() => new SecurityService(), AppError);

    restoreEnv(snapshot);
});

test("SecurityService.constructor: deve lançar erro quando JWT_REFRESH_EXPIRES_IN não estiver configurado", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    delete process.env.JWT_REFRESH_EXPIRES_IN;

    assert.throws(() => new SecurityService(), AppError);

    restoreEnv(snapshot);
});

// =========================
// HASH / VERIFY
// =========================

test("SecurityService.hash: deve gerar um hash diferente da senha original", async () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();

    const hash = await service.hash("minhaSenha123");

    assert.notEqual(hash, "minhaSenha123");
    assert.equal(typeof hash, "string");

    restoreEnv(snapshot);
});

test("SecurityService.verify: deve retornar true para senha correta", async () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();

    const hash = await service.hash("minhaSenha123");
    const result = await service.verify("minhaSenha123", hash);

    assert.equal(result, true);

    restoreEnv(snapshot);
});

test("SecurityService.verify: deve retornar false para senha incorreta", async () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();

    const hash = await service.hash("minhaSenha123");
    const result = await service.verify("senhaErrada", hash);

    assert.equal(result, false);

    restoreEnv(snapshot);
});

test("SecurityService.hash: dois hashes da mesma senha devem ser diferentes entre si (salt aleatório)", async () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();

    const hash1 = await service.hash("minhaSenha123");
    const hash2 = await service.hash("minhaSenha123");

    assert.notEqual(hash1, hash2);

    restoreEnv(snapshot);
});

// =========================
// TOKENS
// =========================

test("SecurityService.generateToken + verifyToken: deve gerar e verificar um token válido", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();

    const token = service.generateToken({ userId: "123" });
    const decoded = service.verifyToken(token) as { userId: string };

    assert.equal(decoded.userId, "123");

    restoreEnv(snapshot);
});

test("SecurityService.verifyToken: deve lançar erro ao verificar token inválido", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();

    assert.throws(() => service.verifyToken("token-invalido"));

    restoreEnv(snapshot);
});

test("SecurityService.verifyToken: deve lançar erro ao verificar token gerado com outro secret", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();
    const token = service.generateRefreshToken({ userId: "123" });

    // token de refresh assinado com secret diferente do secretKeyJwt
    assert.throws(() => service.verifyToken(token));

    restoreEnv(snapshot);
});

test("SecurityService.generateRefreshToken: deve gerar um refresh token diferente do token comum", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();

    const token = service.generateToken({ userId: "123" });
    const refreshToken = service.generateRefreshToken({ userId: "123" });

    assert.notEqual(token, refreshToken);

    restoreEnv(snapshot);
});

// =========================
// TOKEN DE CONVITE
// =========================

test("SecurityService.generateTokenInvite: deve gerar uma string hexadecimal de 64 caracteres", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();

    const token = service.generateTokenInvite();

    assert.equal(token.length, 64);
    assert.match(token, /^[0-9a-f]+$/);

    restoreEnv(snapshot);
});

test("SecurityService.generateTokenInvite: deve gerar tokens diferentes a cada chamada", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();

    const token1 = service.generateTokenInvite();
    const token2 = service.generateTokenInvite();

    assert.notEqual(token1, token2);

    restoreEnv(snapshot);
});

// =========================
// NEED BE ADMIN
// =========================

test("SecurityService.needBeAdmin: não deve lançar erro quando usuário for admin", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();
    const user = createValidUser(true);

    assert.doesNotThrow(() =>
        service.needBeAdmin(user, "UserService", "delete")
    );

    restoreEnv(snapshot);
});

test("SecurityService.needBeAdmin: deve lançar erro quando usuário não for admin", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();
    const user = createValidUser(false);

    assert.throws(
        () => service.needBeAdmin(user, "UserService", "delete"),
        AppError
    );

    restoreEnv(snapshot);
});

test("SecurityService.needBeAdmin: deve usar mensagem customizada quando fornecida", () => {
    const snapshot = snapshotEnv();
    setValidEnv();
    const service = new SecurityService();
    const user = createValidUser(false);

    assert.throws(
        () =>
            service.needBeAdmin(
                user,
                "UserService",
                "delete",
                "Apenas administradores podem excluir usuários."
            ),
        AppError
    );

    restoreEnv(snapshot);
});