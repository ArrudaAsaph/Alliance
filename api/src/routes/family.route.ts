import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import FamilyController from "../controllers/family.controller";
import ValidationMiddleware from "../middleware/validation.middleware";
import { FamilyValidation } from "../validations/family.validation";

const router = Router();

router.post(
    "/",
    AuthMiddleware.authenticate,
    ValidationMiddleware.validate({ body: FamilyValidation.create }),
    FamilyController.create
);
router.get(
    "/myFamilies",
    AuthMiddleware.authenticate,
    ValidationMiddleware.validate({ query: FamilyValidation.filters }),
    FamilyController.findMyFamilies
);

export default router;
