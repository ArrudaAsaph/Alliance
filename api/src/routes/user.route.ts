import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/me", AuthMiddleware.authenticate, UserController.findMe);
router.get("/all", AuthMiddleware.authenticate, UserController.findAll);
router.patch("/me", AuthMiddleware.authenticate, UserController.update);


export default router;
