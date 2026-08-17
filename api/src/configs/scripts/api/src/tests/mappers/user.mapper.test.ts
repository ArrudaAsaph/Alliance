import test from "node:test";
import assert from "node:assert/strict";
import { UserMapper } from "../../mappers/user.mapper";
import { User } from "../../models/user.models";
import { Person } from "../../models/person.model";

test("UserMapper: não expõe senha e inclui person quando carregada", () => {
    const person = Object.assign(new Person(), { firstName: "Ana", lastName: "Silva", birthday: new Date("1990-01-02") });
    const user = Object.assign(new User(), {
        id: "user-id", username: "ana", email: "ana@example.com", password: "segredo",
        createdAt: new Date("2026-01-01"), lastLogin: null, person
    });
    const response = UserMapper.toResponseDTO(user);
    assert.equal("password" in response, false);
    assert.equal(response.person?.firstName, "Ana");
    assert.deepEqual(UserMapper.toSimpleResponseDTO(user), { id: "user-id", username: "ana" });
});

test("UserMapper: converte DTO de criação em entidade", () => {
    const user = UserMapper.toEntity({ username: "ana", email: "ana@example.com", password: "Senha123", confirmPassword: "Senha123" });
    assert.equal(user.username, "ana");
    assert.equal(user.email, "ana@example.com");
    assert.equal(user.password, "Senha123");
});
