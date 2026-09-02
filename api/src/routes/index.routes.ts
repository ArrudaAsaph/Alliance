import { Router } from "express";
import registrationRouter from "./registration.route";
import authRoutes from './auth.route'
import userRoutes from "./user.route";
import familyRoutes from "./family.route";
const router = Router()

router.use('/signup', registrationRouter)
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/families", familyRoutes);

export default router;