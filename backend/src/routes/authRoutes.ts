import { Router } from "express";
import { register, verifyEmail, login } from "../controllers/authController";

const router = Router();

// POST /api/register
router.post("/register", register);

// GET /api/verify-email/:token
router.get("/verify-email/:token", verifyEmail);

// POST /api/login
router.post("/login", login);

export default router;
