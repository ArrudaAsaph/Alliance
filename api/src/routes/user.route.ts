import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthMiddleware from "../middleware/auth.middleware";
import ValidationMiddleware from "../middleware/validation.middleware";
import { UserValidation } from "../validations/user.validation";

const router = Router();

router.get(
    "/me",
    AuthMiddleware.authenticate,
    UserController.findUserById
);
router.get(
    "/me/:id",
    AuthMiddleware.authenticate,
    ValidationMiddleware.validate({ params: UserValidation.id }),
    UserController.findUserById
);
router.get(
    "/all",
    AuthMiddleware.authenticate,
    ValidationMiddleware.validate({ query: UserValidation.filters }),
    UserController.findAll
);
router.patch(
    "/me",
    AuthMiddleware.authenticate,
    ValidationMiddleware.validate({ body: UserValidation.update }),
    UserController.update
);
router.delete(
    "/me",
    AuthMiddleware.authenticate,
    ValidationMiddleware.validate({ body: UserValidation.credentials }),
    UserController.delete
);
router.patch(
    "/:id/userAdmin",
    AuthMiddleware.authenticate,
    ValidationMiddleware.validate({
        params: UserValidation.id,
        body: UserValidation.credentials
    }),
    UserController.makeUserAdmin
);


export default router;
