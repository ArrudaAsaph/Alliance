import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import FamilyController from "../controllers/family.controller";

const router = Router();

router.post("/", AuthMiddleware.authenticate, FamilyController.create);
router.get("/myFamilies", AuthMiddleware.authenticate, FamilyController.findMyFamilies);

export default router;
