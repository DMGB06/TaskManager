import { Request, Response, NextFunction } from "express";
import weeklyRoutineService from "../services/weeklyRoutine.service";
import { AppError } from "../middlewares/errorHandler";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const createRoutine = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const routine = await weeklyRoutineService.createRutine(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Routine created successfully",
      data: routine,
    });
  } catch (error) {
    next(error);
  }
};

// Listar con filtros
export const getMyRoutines = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const routines = await weeklyRoutineService.getMyRoutines(
      userId,
      req.query
    );
    res.json({
      success: true,
      data: routines,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener horario semanal completo
export const getWeeklySchedule = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const schedule = await weeklyRoutineService.getWeeklySchedule(userId);
    res.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error); // ← AGREGAR ESTO
  }
};

// Conseguir rutina del usuario por su id
export const getRoutineById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const routine = await weeklyRoutineService.getRoutineById(
      userId,
      req.params.id
    );
    res.json({
      success: true,
      data: routine,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoutine = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const routine = await weeklyRoutineService.updateRoutine(
      userId,
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Routine updated successfully",
      data: routine,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una rutina
export const deleteRoutine = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id; // ← CAMBIAR de req.params?.id a req.user?.id
    if (!userId) throw new AppError("User not authenticated", 401);

    await weeklyRoutineService.deleteRoutine(userId, req.params.id);
    res.json({
      success: true,
      message: "Routine deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
