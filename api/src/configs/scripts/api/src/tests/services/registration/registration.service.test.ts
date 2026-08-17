import test from "node:test";
import assert from "node:assert/strict";
import { RegistrationService } from "../../../services/registration.service";
import { UserService } from "../../../services/user.service";
import { PersonService } from "../../../services/person.service";
import { User } from "../../../models/user.models";
import { Person } from "../../../models/person.model";

test("RegistrationService coordena a única criação conjunta", async () => {
    const user = Object.assign(new User(), { id: "user-id" });
    let personInput: unknown;
    const users = { create: async () => user, getById: async () => user };
    const persons = { create: async (_user: User, data: unknown) => { personInput = data; return new Person(); } };
    const service = new RegistrationService(users as unknown as UserService, persons as unknown as PersonService);
    const result = await service.create(
        Object.assign(new User(), { username: "ana", email: "ana@example.com", password: "Senha123" }),
        Object.assign(new Person(), { firstName: "Ana", lastName: "Silva", birthday: null }),
        "Senha123",
    );
    assert.equal(result, user);
    assert.ok(personInput instanceof Person);
});
