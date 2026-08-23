import { Router } from "express";
import registrationRouter from "./registration.route";
import authRoutes from './auth.route'
import userRoutes from "./user.route";
import personRoutes from "./person.route";
const router = Router()

router.use('/signup', registrationRouter)
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/persons", personRoutes);

export default router;