import test from "node:test";
import assert from "node:assert/strict";
import { PersonService } from "../../../services/person.service";
import PersonRepository from "../../../repositories/person.repository";
import { Person } from "../../../models/person.model";
import { User } from "../../../models/user.models";
import { AppError } from "../../../models/error.model";

const user = Object.assign(new User(), { id: "93ae69c3-6d3f-4b76-b6e3-36f5e0bdc7e2" });

test("PersonService.create normaliza nome e converte aniversário", async () => {
    let saved: Partial<Person> | undefined;
    const repository = { create: async (data: Partial<Person>) => { saved = data; return Object.assign(new Person(), data); } };
    const service = new PersonService(repository as unknown as PersonRepository);
    const person = Object.assign(new Person(), { firstName: " Ana ", lastName: " Silva ", birthday: new Date("1990-01-02") });
    await service.create(user, person);
    assert.equal(saved?.firstName, "Ana");
    assert.equal(saved?.birthday?.toISOString().slice(0, 10), "1990-01-02");
    assert.equal(saved?.updatedAt, null);
});

test("PersonService.update atualiza somente os campos recebidos", async () => {
    let changes: Partial<Person> | undefined;
    const person = Object.assign(new Person(), { id: "person-id", firstName: "Ana", lastName: "Silva", birthday: null });
    const repository = { findByUserId: async () => person, update: async (_id: string, data: Partial<Person>) => { changes = data; return Object.assign(person, data); } };
    const service = new PersonService(repository as unknown as PersonRepository);
    await service.update(person, Object.assign(new Person(), { birthday: null, firstName: "Maria" }));
    assert.deepEqual(changes, { firstName: "Maria", birthday: null });
});

test("PersonService.getByUserId retorna 404 sem perfil", async () => {
    const service = new PersonService({ findByUserId: async () => null } as unknown as PersonRepository);
    await assert.rejects(() => service.getByUserId(user.id), (error: unknown) => error instanceof AppError && error.code === 404);
});
