import z from "zod";
import { UserValidation } from "./user.validation";
import { PersonValidation } from "./person.validation";

export const RegistrationValidation = {
   
    create: z.object({
        user: UserValidation.create,
        person: PersonValidation.create
    }).strict()
};
