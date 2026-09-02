import { Router } from "express";
import PersonController from "../controllers/person.controller";
import AuthMiddleware from "../middleware/auth.middleware";
import ValidationMiddleware from "../middleware/validation.middleware";
import { PersonValidation } from "../validations/person.validation";

const router = Router();

router.get(
    "/all",
    AuthMiddleware.authenticate,
    ValidationMiddleware.validate({ query: PersonValidation.filters }),
    PersonController.findAll
);
router.patch(
    "/me",
    AuthMiddleware.authenticate,
    ValidationMiddleware.validate({ body: PersonValidation.update }),
    PersonController.update
);



export default router;
