import test from "node:test";
import assert from "node:assert/strict";

import { Person } from "../../models/person.model";
import { AppError } from "../../models/error.model";

function createValidPerson(): Person {
    const person = new Person();

    person.firstName = "Asaph";
    person.lastName = "Arruda";
    person.birthday = new Date("2000-01-01");

    return person;
}

test("Person.validateForCreate: deve aceitar uma pessoa válida", () => {
    const person = createValidPerson();

    assert.doesNotThrow(() => person.validateForCreate());
});

test("Person.validateForCreate: deve remover espaços do primeiro nome", () => {
    const person = createValidPerson();

    person.firstName = "   Asaph   ";

    person.validateForCreate();

    assert.equal(person.firstName, "Asaph");
});

test("Person.validateForCreate: deve remover espaços do sobrenome", () => {
    const person = createValidPerson();

    person.lastName = "   Arruda   ";

    person.validateForCreate();

    assert.equal(person.lastName, "Arruda");
});

test("Person.validateForCreate: deve lançar erro quando primeiro nome estiver vazio", () => {
    const person = createValidPerson();

    person.firstName = "";

    assert.throws(() => person.validateForCreate(), AppError);
});

test("Person.validateForCreate: deve lançar erro quando primeiro nome possuir menos de 2 caracteres", () => {
    const person = createValidPerson();

    person.firstName = "A";

    assert.throws(() => person.validateForCreate(), AppError);
});

test("Person.validateForCreate: deve lançar erro quando primeiro nome possuir mais de 50 caracteres", () => {
    const person = createValidPerson();

    person.firstName = "A".repeat(51);

    assert.throws(() => person.validateForCreate(), AppError);
});

test("Person.validateForCreate: deve lançar erro quando sobrenome estiver vazio", () => {
    const person = createValidPerson();

    person.lastName = "";

    assert.throws(() => person.validateForCreate(), AppError);
});

test("Person.validateForCreate: deve lançar erro quando sobrenome possuir menos de 2 caracteres", () => {
    const person = createValidPerson();

    person.lastName = "A";

    assert.throws(() => person.validateForCreate(), AppError);
});

test("Person.validateForCreate: deve lançar erro quando sobrenome possuir mais de 50 caracteres", () => {
    const person = createValidPerson();

    person.lastName = "A".repeat(51);

    assert.throws(() => person.validateForCreate(), AppError);
});

test("Person.validateForCreate: deve aceitar data de nascimento nula", () => {
    const person = createValidPerson();

    person.birthday = null;

    assert.doesNotThrow(() => person.validateForCreate());
});

test("Person.validateForCreate: deve lançar erro quando data de nascimento for futura", () => {
    const person = createValidPerson();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    person.birthday = tomorrow;

    assert.throws(() => person.validateForCreate(), AppError);
});

test("Person.validateForUpdate: deve validar uma pessoa válida", () => {
    const person = createValidPerson();

    assert.doesNotThrow(() => person.validateForUpdate());
});

test("Person.validateForUpdate: deve lançar erro quando primeiro nome for inválido", () => {
    const person = createValidPerson();

    person.firstName = "";

    assert.throws(() => person.validateForUpdate(), AppError);
});

test("Person.validateForUpdate: deve lançar erro quando sobrenome for inválido", () => {
    const person = createValidPerson();

    person.lastName = "";

    assert.throws(() => person.validateForUpdate(), AppError);
});

test("Person.validateForUpdate: deve aceitar data de nascimento nula", () => {
    const person = createValidPerson();

    person.birthday = null;

    assert.doesNotThrow(() => person.validateForUpdate());
});

test("Person.validateForUpdate: deve lançar erro quando data de nascimento for futura", () => {
    const person = createValidPerson();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    person.birthday = tomorrow;

    assert.throws(() => person.validateForUpdate(), AppError);
});