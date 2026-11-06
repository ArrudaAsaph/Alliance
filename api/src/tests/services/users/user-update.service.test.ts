import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../../../errors/error";
import type { UpdateUserDTO } from "../../../dtos/user.dto";
import { createValidUser, createUserService } from "../../helpers/user-test.helpers";

test("UserService.update: deve atualizar apenas username e email", async () => {
    const { service } = createUserService();
    const user = createValidUser("user-id");
    const changes: UpdateUserDTO = {
        username: "novo_username",
        email: "novo@email.com",
    };

    const result = await service.update(user, changes);

    assert.equal(result.username, "novo_username");
    assert.equal(result.email, "novo@email.com");
    assert.equal(result.password, "12345678");
});

test("UserService.update: deve rejeitar alteração de senha", async () => {
    const { service } = createUserService();
    const user = createValidUser("user-id");

    await assert.rejects(
        () => service.update(user, { password: "novaSenha123" } as unknown as UpdateUserDTO),
        AppError
    );
});
