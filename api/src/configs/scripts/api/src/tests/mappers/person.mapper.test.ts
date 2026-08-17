import test from "node:test";
import assert from "node:assert/strict";
import { PersonMapper } from "../../mappers/person.mapper";
import { Person } from "../../models/person.model";

test("PersonMapper: preserva birthday ao criar entidade", () => {
    const person = PersonMapper.toEntity({ firstName: "Ana", lastName: "Silva", birthday: "1990-01-02" });
    assert.equal(person.birthday?.toISOString().slice(0, 10), "1990-01-02");
});

test("PersonMapper: cria respostas completa e simples", () => {
    const person = Object.assign(new Person(), { id: "person-id", firstName: "Ana", lastName: "Silva", birthday: null });
    assert.deepEqual(PersonMapper.toResponseDTO(person), { id: "person-id", firstName: "Ana", lastName: "Silva", birthday: null });
    assert.deepEqual(PersonMapper.toSimpleResponseDTO(person), { id: "person-id", firstName: "Ana", lastName: "Silva" });
});
