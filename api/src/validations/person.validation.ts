import z from "zod";

export const PersonValidation = {
    // create
    create: z.object({
        firstName: z.string().min(2).max(50),
        lastName: z.string().min(2).max(50),
        birthday: z.coerce.date().nullable().optional()
    }).strict(),

    update: z.object({
        firstName: z.string().min(2).max(50).optional(),
        lastName: z.string().min(2).max(50).optional(),
        birthday: z.coerce.date().nullable().optional()
    }).strict().refine(
        value => Object.keys(value).length > 0,
        "Informe ao menos um campo para atualizar."
    ),

    filters: z.object({
        id: z.uuid().optional(),
        firstName: z.string().min(1).max(50).optional(),
        lastName: z.string().min(1).max(50).optional(),
        createdAtFrom: z.iso.date().optional(),
        createdAtTo: z.iso.date().optional(),
        updatedAtFrom: z.iso.date().optional(),
        updatedAtTo: z.iso.date().optional(),
        birthdayFrom: z.iso.date().optional(),
        birthdayTo: z.iso.date().optional(),
        simpleResponse: z.enum(["true", "false"]).optional()
    }).strict()
};
