import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import sendEmail from "../utils/sendEmail";

// POST /api/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email, and password are required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = uuidv4();

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
      isVerified: true, // Auto-verified for demo purposes
      verificationToken: null,
    });

    res.status(201).json({
      message: "Registration successful! You can now log in.",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }
    res.status(500).json({ message: "Server error during registration" });
  }
};

// GET /api/verify-email/:token
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ message: "Verification token is required" });
      return;
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      res.status(404).json({ message: "Invalid or expired verification token" });
      return;
    }

    if (user.isVerified) {
      res.status(200).json({ message: "Email is already verified" });
      return;
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Server error during email verification" });
  }
};

// POST /api/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }



    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: "Server configuration error" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
