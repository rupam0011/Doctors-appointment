import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllAppointments,
} from "../controllers/appointmentController";
import verifyToken from "../middleware/verifyToken";
import isAdmin from "../middleware/isAdmin";

const router = Router();

// POST /api/appointments (Protected)
router.post("/appointments", verifyToken, createAppointment);

// GET /api/my-appointments (Protected)
router.get("/my-appointments", verifyToken, getMyAppointments);

// PUT /api/appointments/:id/cancel (Protected)
router.put("/appointments/:id/cancel", verifyToken, cancelAppointment);

// GET /api/all-appointments (Admin Only)
router.get("/all-appointments", verifyToken, isAdmin, getAllAppointments);

export default router;
