import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../../models/error.model";

test("AppError: preserva os metadados da falha", () => {
    const error = new AppError("user", "create", "inválido", 400, ["email"]);
    assert.equal(error.name, "AppError");
    assert.equal(error.entity, "user");
    assert.equal(error.action, "create");
    assert.equal(error.code, 400);
    assert.deepEqual(error.data, ["email"]);
    assert.ok(error.date instanceof Date);
});
