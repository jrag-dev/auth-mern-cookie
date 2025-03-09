import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { isAuthRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', validateSchema(registerSchema), authController.register);
router.post('/login', validateSchema(loginSchema), authController.login);
router.post('/logout', authController.logout);

// Private routes
router.get('/profile', isAuthRequired, authController.profile)

export default router;