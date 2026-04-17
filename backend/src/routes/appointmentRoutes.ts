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

router.post("/appointments", verifyToken, createAppointment);
router.get("/my-appointments", verifyToken, getMyAppointments);
router.put("/appointments/:id/cancel", verifyToken, cancelAppointment);
router.get("/all-appointments", verifyToken, isAdmin, getAllAppointments);

export default router;
