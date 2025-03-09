import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { isAuthRequired } from "../middlewares/validateToken.js";

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Private routes
router.get('/profile', isAuthRequired, authController.profile)

export default router;