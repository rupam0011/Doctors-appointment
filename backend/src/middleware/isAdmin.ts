import { Response, NextFunction } from "express";
import { AuthRequest } from "./verifyToken";

const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Need to be Admin." });
    return;
  }
  next();
};

export default isAdmin;
