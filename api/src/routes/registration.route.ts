import { Router } from "express";
import RegistrationController from "../controllers/registration.controler";
import ValidationMiddleware from "../middleware/validation.middleware";
import { RegistrationValidation } from "../validations/registration.validation";
const registrationRouter = Router();

registrationRouter.post(
    "/",
    ValidationMiddleware.validate({
        body: RegistrationValidation.create
    }),
    RegistrationController.create
);

export default registrationRouter;
