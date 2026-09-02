import z from "zod";

export const UserValidation = {
    // Create
    create: z.object({
        username: z.string().min(3).max(100),
        email: z.email(),
        password: z.string().min(8).max(128),
        confirmPassword: z.string().min(8).max(128)
    }).strict(),

    update: z.object({
        username: z.string().min(3).max(100).regex(/^[a-zA-Z0-9_-]+$/).optional(),
        email: z.email().optional()
    }).strict().refine(
        value => Object.keys(value).length > 0,
        "Informe ao menos um campo para atualizar."
    ),

    credentials: z.object({
        password: z.string().min(8).max(128)
    }).strict(),

    id: z.object({
        id: z.uuid()
    }).strict(),

    filters: z.object({
        id: z.uuid().optional(),
        username: z.string().min(1).max(100).optional(),
        email: z.email().optional(),
        createdAtFrom: z.iso.date().optional(),
        createdAtTo: z.iso.date().optional(),
        updatedAtFrom: z.iso.date().optional(),
        updatedAtTo: z.iso.date().optional(),
        lastLoginFrom: z.iso.date().optional(),
        lastLoginTo: z.iso.date().optional(),
        isAdmin: z.enum(["true", "false"]).optional(),
        simpleResponse: z.enum(["true", "false"]).optional()
    }).strict()
};
