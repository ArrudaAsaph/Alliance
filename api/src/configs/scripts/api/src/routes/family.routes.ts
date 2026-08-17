
import { Router } from "express";
import FamilyController from "../controllers/family.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/", AuthMiddleware.authenticate,FamilyController.create);
router.post("/invite/:id", AuthMiddleware.authenticate,FamilyController.createInvite);
router.patch("/invite/:token", AuthMiddleware.authenticate, FamilyController.updateInvite);
router.post("/join/:token", AuthMiddleware.authenticate,FamilyController.joinInAFamily);
router.get("/createdByMe", AuthMiddleware.authenticate,FamilyController.createdByMe);
router.get("/", AuthMiddleware.authenticate,FamilyController.get);
router.get("/:id", AuthMiddleware.authenticate,FamilyController.getById);
router.patch("/:id", AuthMiddleware.authenticate, FamilyController.update);
router.delete("/:id/members/me", AuthMiddleware.authenticate, FamilyController.leave);
router.delete("/:id", AuthMiddleware.authenticate, FamilyController.delete);


export default router;
