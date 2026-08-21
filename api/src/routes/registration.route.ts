import { Router } from "express";
import RegistrationController from "../controllers/registration.controler";
const registrationRouter = Router();

registrationRouter.post("/", RegistrationController.create);

export default registrationRouter;