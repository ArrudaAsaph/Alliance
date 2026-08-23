import { Router } from "express";
import PersonController from "../controllers/person.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/all", AuthMiddleware.authenticate, PersonController.findAll);
router.patch("/me", AuthMiddleware.authenticate, PersonController.update);



export default router;
