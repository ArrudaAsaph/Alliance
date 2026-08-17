import { Router } from "express";
import PersonController from "../controllers/person.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const router = Router();

router.patch("/me", AuthMiddleware.authenticate, PersonController.updateMe);
router.get("/all", AuthMiddleware.authenticate, PersonController.getAll);
router.get("/:id", AuthMiddleware.authenticate, PersonController.getById);
router.delete("/me", AuthMiddleware.authenticate, PersonController.deleteMe);

export default router;
