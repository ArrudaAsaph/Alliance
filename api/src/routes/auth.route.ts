import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import ValidationMiddleware from "../middleware/validation.middleware";
import { AuthValidation } from "../validations/auth.validation";
const router = Router();

router.post(
    "/login",
    ValidationMiddleware.validate({
        body: AuthValidation.login,
    }),
    AuthController.login);


export default router;
