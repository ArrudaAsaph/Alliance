import { Router } from "express";
import registrationRouter from "./registration.route";

const router = Router()

router.use('/signup', registrationRouter)

export default router;