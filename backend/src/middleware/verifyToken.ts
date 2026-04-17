import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

interface JwtPayload {
  id: string;
  role: string;
}

const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({ message: "Server configuration error" });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
