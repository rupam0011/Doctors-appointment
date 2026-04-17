import { Request, Response } from "express";
import Doctor from "../models/Doctor";

// POST /api/doctors/seed (Admin Only)
export const seedDoctors = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Check if doctors already exist
    const existingCount = await Doctor.countDocuments();
    if (existingCount > 0) {
      res.status(400).json({
        message: `Database already has ${existingCount} doctors. Clear them first if you want to re-seed.`,
      });
      return;
    }

    const doctors = [
      {
        name: "Dr. Ananya Sharma",
        specialization: "Cardiologist",
        fees: 1500,
        availableSlots: [
          { date: "2026-04-20", time: "09:00 AM" },
          { date: "2026-04-20", time: "10:00 AM" },
          { date: "2026-04-20", time: "11:00 AM" },
          { date: "2026-04-21", time: "09:00 AM" },
          { date: "2026-04-21", time: "02:00 PM" },
          { date: "2026-04-22", time: "10:00 AM" },
          { date: "2026-04-22", time: "03:00 PM" },
        ],
      },
      {
        name: "Dr. Rajesh Patel",
        specialization: "Dermatologist",
        fees: 1200,
        availableSlots: [
          { date: "2026-04-20", time: "10:00 AM" },
          { date: "2026-04-20", time: "11:30 AM" },
          { date: "2026-04-20", time: "02:00 PM" },
          { date: "2026-04-21", time: "10:00 AM" },
          { date: "2026-04-21", time: "11:00 AM" },
          { date: "2026-04-22", time: "09:00 AM" },
          { date: "2026-04-22", time: "01:00 PM" },
        ],
      },
      {
        name: "Dr. Priya Mehta",
        specialization: "Pediatrician",
        fees: 1000,
        availableSlots: [
          { date: "2026-04-20", time: "09:30 AM" },
          { date: "2026-04-20", time: "11:00 AM" },
          { date: "2026-04-20", time: "03:00 PM" },
          { date: "2026-04-21", time: "09:00 AM" },
          { date: "2026-04-21", time: "01:00 PM" },
          { date: "2026-04-22", time: "10:30 AM" },
          { date: "2026-04-22", time: "02:30 PM" },
        ],
      },
      {
        name: "Dr. Vikram Singh",
        specialization: "Neurologist",
        fees: 2000,
        availableSlots: [
          { date: "2026-04-20", time: "10:00 AM" },
          { date: "2026-04-20", time: "12:00 PM" },
          { date: "2026-04-21", time: "09:00 AM" },
          { date: "2026-04-21", time: "03:00 PM" },
          { date: "2026-04-22", time: "11:00 AM" },
          { date: "2026-04-22", time: "04:00 PM" },
        ],
      },
      {
        name: "Dr. Sunita Reddy",
        specialization: "Orthopedist",
        fees: 1800,
        availableSlots: [
          { date: "2026-04-20", time: "09:00 AM" },
          { date: "2026-04-20", time: "11:00 AM" },
          { date: "2026-04-20", time: "02:30 PM" },
          { date: "2026-04-21", time: "10:00 AM" },
          { date: "2026-04-21", time: "12:00 PM" },
          { date: "2026-04-22", time: "09:30 AM" },
          { date: "2026-04-22", time: "03:30 PM" },
        ],
      },
    ];

    const insertedDoctors = await Doctor.insertMany(doctors);

    res.status(201).json({
      message: `Successfully seeded ${insertedDoctors.length} doctors`,
      doctors: insertedDoctors,
    });
  } catch (error) {
    console.error("Seed doctors error:", error);
    res.status(500).json({ message: "Server error while seeding doctors" });
  }
};

// GET /api/doctors
export const getDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { specialization } = req.query;

    let filter = {};
    if (specialization && typeof specialization === "string") {
      filter = { specialization: { $regex: specialization, $options: "i" } };
    }

    const doctors = await Doctor.find(filter).sort({ name: 1 });

    res.status(200).json({
      message: "Doctors fetched successfully",
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({ message: "Server error while fetching doctors" });
  }
};

// GET /api/doctors/:id
export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    res.status(200).json({ doctor });
  } catch (error) {
    console.error("Get doctor by ID error:", error);
    res.status(500).json({ message: "Server error while fetching doctor" });
  }
};

// POST /api/doctors (Admin Only)
export const createDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, specialization, fees } = req.body;

    if (!name || !specialization || !fees) {
      res.status(400).json({ message: "Name, specialization, and fees are required" });
      return;
    }

    // Generate dynamic slots for the next 7 days
    const availableSlots = [];
    const baseTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:30 PM", "04:00 PM"];
    
    for (let i = 1; i <= 7; i++) {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + i);
      const dateStr = dateObj.toISOString().split('T')[0];
      
      // Add a mix of 3-4 random time slots per day while keeping chronological order
      for (const time of baseTimes) {
        if (Math.random() > 0.3) {
          availableSlots.push({ date: dateStr, time });
        }
      }
    }

    const newDoctor = await Doctor.create({
      name,
      specialization,
      fees: Number(fees),
      availableSlots,
    });

    res.status(201).json({
      message: "Doctor created successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("Create doctor error:", error);
    res.status(500).json({ message: "Server error while creating doctor" });
  }
};
