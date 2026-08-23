import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/me", AuthMiddleware.authenticate, UserController.findUserById);
router.get("/me/:id", AuthMiddleware.authenticate, UserController.findUserById);
router.get("/all", AuthMiddleware.authenticate, UserController.findAll);
router.patch("/me", AuthMiddleware.authenticate, UserController.update);
router.delete("/me", AuthMiddleware.authenticate, UserController.delete);
router.patch("/:id/userAdmin", AuthMiddleware.authenticate, UserController.makeUserAdmin);


export default router;
