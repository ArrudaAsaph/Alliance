import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from './auth.routes'
import personRoutes from "./person.routes";
import familyRoutes from "./family.routes"
import groupRoutes from './group.routes';


const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/persons", personRoutes);
router.use("/families", familyRoutes);
router.use("/groups", groupRoutes);

export default router;
