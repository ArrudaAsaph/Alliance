import z from "zod";

export const FamilyValidation = {
    create: z.object({
        name: z.string().min(3).max(50)
    }).strict(),

    filters: z.object({
        id: z.uuid().optional(),
        name: z.string().min(1).max(50).optional(),
        createdByMe: z.enum(["true", "false"]).optional(),
        memberName: z.string().min(1).max(100).optional(),
        createdAtFrom: z.iso.date().optional(),
        createdAtTo: z.iso.date().optional(),
        updatedAtFrom: z.iso.date().optional(),
        updatedAtTo: z.iso.date().optional(),
        simpleResponse: z.enum(["true", "false"]).optional()
    }).strict()
};
