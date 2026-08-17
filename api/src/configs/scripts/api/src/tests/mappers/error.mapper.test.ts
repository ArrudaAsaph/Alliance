import test from "node:test";
import assert from "node:assert/strict";
import { AppErrorMapper } from "../../mappers/error.mapper";
import { AppError } from "../../models/error.model";

test("AppErrorMapper: retorna somente o contrato público do erro", () => {
    const error = new AppError("user", "create", "inválido", 400, ["email"], "interno");
    assert.deepEqual(AppErrorMapper.toResponseDTO(error), { message: "inválido", code: 400, data: ["email"] });
});
