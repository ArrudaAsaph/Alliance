import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/", UserController.create);
router.get("/all", AuthMiddleware.authenticate,UserController.getAll);
router.get("/me", 
    AuthMiddleware.authenticate,
    UserController.me);
router.patch("/me", AuthMiddleware.authenticate, UserController.updateMe);
router.delete("/me", AuthMiddleware.authenticate, UserController.deleteMe);

export default router;
