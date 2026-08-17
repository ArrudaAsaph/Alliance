import test from "node:test";
import assert from "node:assert/strict";

import { User } from "../../models/user.models";
import { AppError } from "../../models/error.model";

function createValidUser(): User {
    const user = new User();

    user.username = "asaph";
    user.email = "asaph@email.com";
    user.password = "12345678";

    return user;
}

test("User.validateForCreate: deve aceitar um usuário válido", () => {
    const user = createValidUser();

    assert.doesNotThrow(() => user.validateForCreate());
});

test("User.validateForCreate: deve remover espaços do username", () => {
    const user = createValidUser();

    user.username = "   asaph   ";

    user.validateForCreate();

    assert.equal(user.username, "asaph");
});

test("User.validateForCreate: deve remover espaços e converter email para minúsculo", () => {
    const user = createValidUser();

    user.email = "  ASAPH@EMAIL.COM  ";

    user.validateForCreate();

    assert.equal(user.email, "asaph@email.com");
});

test("User.validateForCreate: deve lançar erro quando username estiver vazio", () => {
    const user = createValidUser();

    user.username = "";

    assert.throws(() => user.validateForCreate(), AppError);
});

test("User.validateForCreate: deve lançar erro quando username possuir menos de 3 caracteres", () => {
    const user = createValidUser();

    user.username = "ab";

    assert.throws(() => user.validateForCreate(), AppError);
});

test("User.validateForCreate: deve lançar erro quando username possuir mais de 100 caracteres", () => {
    const user = createValidUser();

    user.username = "a".repeat(101);

    assert.throws(() => user.validateForCreate(), AppError);
});

test("User.validateForCreate: deve lançar erro quando username possuir caracteres inválidos", () => {
    const user = createValidUser();

    user.username = "@asaph";

    assert.throws(() => user.validateForCreate(), AppError);
});

test("User.validateForCreate: deve lançar erro quando email estiver vazio", () => {
    const user = createValidUser();

    user.email = "";

    assert.throws(() => user.validateForCreate(), AppError);
});

test("User.validateForCreate: deve lançar erro quando email for inválido", () => {
    const user = createValidUser();

    user.email = "email-invalido";

    assert.throws(() => user.validateForCreate(), AppError);
});

test("User.validateForCreate: deve lançar erro quando senha estiver vazia", () => {
    const user = createValidUser();

    user.password = "";

    assert.throws(() => user.validateForCreate(), AppError);
});

test("User.validateForCreate: deve lançar erro quando senha possuir menos de 8 caracteres", () => {
    const user = createValidUser();

    user.password = "1234567";

    assert.throws(() => user.validateForCreate(), AppError);
});

test("User.validateForCreate: deve lançar erro quando senha possuir mais de 128 caracteres", () => {
    const user = createValidUser();

    user.password = "a".repeat(129);

    assert.throws(() => user.validateForCreate(), AppError);
});

test("User.validateForUpdate: deve validar username e email", () => {
    const user = createValidUser();

    assert.doesNotThrow(() => user.validateForUpdate());
});

test("User.validateForUpdate: não deve validar senha", () => {
    const user = createValidUser();

    user.password = "";

    assert.doesNotThrow(() => user.validateForUpdate());
});

test("User.validatePasswordChange: deve aceitar senha válida", () => {
    const user = createValidUser();

    assert.doesNotThrow(() => user.validatePasswordChange());
});

test("User.validatePasswordChange: deve rejeitar senha inválida", () => {
    const user = createValidUser();

    user.password = "123";

    assert.throws(() => user.validatePasswordChange(), AppError);
});