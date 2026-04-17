import { Router } from "express";
import { seedDoctors, getDoctors, getDoctorById, createDoctor } from "../controllers/doctorController";
import verifyToken from "../middleware/verifyToken";
import isAdmin from "../middleware/isAdmin";

const router = Router();

// POST /api/doctors/seed (Admin Only)
router.post("/doctors/seed", verifyToken, isAdmin, seedDoctors);

// POST /api/doctors (Admin Only)
router.post("/doctors", verifyToken, isAdmin, createDoctor);

// GET /api/doctors (Public)
router.get("/doctors", getDoctors);

// GET /api/doctors/:id (Public)
router.get("/doctors/:id", getDoctorById);

export default router;
