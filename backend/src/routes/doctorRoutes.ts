import { Router } from "express";
import { seedDoctors, getDoctors, getDoctorById, createDoctor } from "../controllers/doctorController";
import verifyToken from "../middleware/verifyToken";
import isAdmin from "../middleware/isAdmin";

const router = Router();

router.post("/doctors/seed", verifyToken, isAdmin, seedDoctors);
router.post("/doctors", verifyToken, isAdmin, createDoctor);
router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctorById);

export default router;
