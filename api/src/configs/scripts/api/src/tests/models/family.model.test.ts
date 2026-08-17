import test from "node:test";
import assert from "node:assert/strict";

import { Family } from "../../models/family.model";
import { AppError } from "../../models/error.model";

function createValidFamily(): Family {
    const family = new Family();

    family.name = "Família Arruda";

    return family;
}

test("Family.validateForCreate: deve aceitar uma família válida", () => {
    const family = createValidFamily();

    assert.doesNotThrow(() => family.validateForCreate());
});

test("Family.validateForCreate: deve remover espaços do nome", () => {
    const family = createValidFamily();

    family.name = "   Família Arruda   ";

    family.validateForCreate();

    assert.equal(family.name, "Família Arruda");
});

test("Family.validateForCreate: deve lançar erro quando nome estiver vazio", () => {
    const family = createValidFamily();

    family.name = "";

    assert.throws(() => family.validateForCreate(), AppError);
});

test("Family.validateForCreate: deve lançar erro quando nome possuir menos de 3 caracteres", () => {
    const family = createValidFamily();

    family.name = "AB";

    assert.throws(() => family.validateForCreate(), AppError);
});

test("Family.validateForCreate: deve lançar erro quando nome possuir mais de 50 caracteres", () => {
    const family = createValidFamily();

    family.name = "A".repeat(51);

    assert.throws(() => family.validateForCreate(), AppError);
});

test("Family.validateForUpdate: deve aceitar uma família válida", () => {
    const family = createValidFamily();

    assert.doesNotThrow(() => family.validateForUpdate());
});

test("Family.validateForUpdate: deve remover espaços do nome", () => {
    const family = createValidFamily();

    family.name = "   Família Arruda   ";

    family.validateForUpdate();

    assert.equal(family.name, "Família Arruda");
});

test("Family.validateForUpdate: deve lançar erro quando nome estiver vazio", () => {
    const family = createValidFamily();

    family.name = "";

    assert.throws(() => family.validateForUpdate(), AppError);
});

test("Family.validateForUpdate: deve lançar erro quando nome possuir menos de 3 caracteres", () => {
    const family = createValidFamily();

    family.name = "AB";

    assert.throws(() => family.validateForUpdate(), AppError);
});

test("Family.validateForUpdate: deve lançar erro quando nome possuir mais de 50 caracteres", () => {
    const family = createValidFamily();

    family.name = "A".repeat(51);

    assert.throws(() => family.validateForUpdate(), AppError);
});