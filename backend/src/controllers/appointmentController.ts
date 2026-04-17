import { Response } from "express";
import { AuthRequest } from "../middleware/verifyToken";
import Appointment from "../models/Appointment";
import Doctor from "../models/Doctor";

// POST /api/appointments (Protected)
export const createAppointment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { doctorId, date, time } = req.body;
    const userId = req.user?.id;

    // Validation
    if (!doctorId || !date || !time) {
      res.status(400).json({ message: "doctorId, date, and time are required" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    // Check if the requested slot is in the doctor's available slots
    const slotExists = doctor.availableSlots.some(
      (slot) => slot.date === date && slot.time === time
    );
    if (!slotExists) {
      res.status(400).json({ message: "Selected time slot is not available for this doctor" });
      return;
    }

    // CRITICAL: Check for double-booking
    // Check if an appointment already exists for the same doctor, date, time with "booked" status
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: "booked",
    });

    if (existingAppointment) {
      res.status(409).json({
        message: "This time slot is already booked. Please choose a different slot.",
      });
      return;
    }

    // Create the appointment
    // The partial unique index on the Appointment model will also prevent race conditions
    try {
      const appointment = await Appointment.create({
        userId,
        doctorId,
        date,
        time,
        status: "booked",
      });

      const populatedAppointment = await Appointment.findById(appointment._id)
        .populate("doctorId", "name specialization fees")
        .populate("userId", "name email");

      res.status(201).json({
        message: "Appointment booked successfully!",
        appointment: populatedAppointment,
      });
    } catch (error: any) {
      // Handle duplicate key error from the partial unique index (race condition safety net)
      if (error.code === 11000) {
        res.status(409).json({
          message: "This time slot is already booked. Please choose a different slot.",
        });
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({ message: "Server error while booking appointment" });
  }
};

// GET /api/my-appointments (Protected)
export const getMyAppointments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const appointments = await Appointment.find({ userId })
      .populate("doctorId", "name specialization fees")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Appointments fetched successfully",
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get my appointments error:", error);
    res.status(500).json({ message: "Server error while fetching appointments" });
  }
};

// PUT /api/appointments/:id/cancel (Protected)
export const cancelAppointment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    // Verify this appointment belongs to the authenticated user
    if (appointment.userId.toString() !== userId) {
      res.status(403).json({ message: "You can only cancel your own appointments" });
      return;
    }

    if (appointment.status === "cancelled") {
      res.status(400).json({ message: "This appointment is already cancelled" });
      return;
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({ message: "Server error while cancelling appointment" });
  }
};

// GET /api/all-appointments (Admin Only)
export const getAllAppointments = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const appointments = await Appointment.find()
      .populate("userId", "name email")
      .populate("doctorId", "name specialization fees")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All appointments fetched successfully",
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get all appointments error:", error);
    res.status(500).json({ message: "Server error while fetching all appointments" });
  }
};
