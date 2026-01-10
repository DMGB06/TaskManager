import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "./errorHandler";
import User from "../models/user";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Leer token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    // 2. Extraer token (quitar "Bearer ")
    const token = authHeader.split(" ")[1];

    // 3. Verificar token
    const decoded = verifyToken(token) as { id: string };

    // 4. Verificar que el usuario existe y está activo
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new AppError("User not found or inactive", 401);
    }

    // 5. Agregar user al request
    req.user = { id: user._id.toString() };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      throw new AppError("Admin access required", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
