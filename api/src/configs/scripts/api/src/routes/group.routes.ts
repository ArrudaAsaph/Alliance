import { Router } from "express";
import GroupController from "../controllers/group.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/", AuthMiddleware.authenticate, GroupController.create);
router.post("/:familyId", AuthMiddleware.authenticate, GroupController.create);
router.get("/", AuthMiddleware.authenticate, GroupController.getMyGroup);

export default router;
