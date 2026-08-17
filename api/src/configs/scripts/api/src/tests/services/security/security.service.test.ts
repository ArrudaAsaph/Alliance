import test from "node:test";
import assert from "node:assert/strict";
import SecurityService from "../../../services/security.service";

test("SecurityService cria hash e valida a senha", async () => {
    const service = new SecurityService();
    const hash = await service.hash("Senha123");
    assert.notEqual(hash, "Senha123");
    assert.equal(await service.verify("Senha123", hash), true);
    assert.equal(await service.verify("OutraSenha", hash), false);
});

test("SecurityService gera e valida token de acesso", () => {
    const service = new SecurityService();
    const token = service.generateToken({ id: "user-id", username: "ana" });
    const payload = service.verifyToken(token);
    assert.equal(typeof payload, "object");
    assert.equal(typeof payload === "object" && payload !== null ? payload.id : undefined, "user-id");
});
