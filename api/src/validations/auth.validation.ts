import z from "zod";

export const AuthValidation = {
    // login
    login: z.object({
        username: z.union([
            z.email(),
            z.string().min(3).max(100).regex(/^[a-zA-Z0-9_-]+$/)
        ]),
        password: z.string().min(8).max(128)
    }).strict()
};
