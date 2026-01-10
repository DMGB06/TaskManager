import { Request, Response, NextFunction } from "express";
import taskService from "../services/task.service";
import { AppError } from "../middlewares/errorHandler";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const task = await taskService.createTask(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const result = await taskService.getMyTasks(userId, req.query);
    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const task = await taskService.getTaskById(userId, req.params.id);
    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    const task = await taskService.updateTask(userId, req.params.id, req.body);
    res.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

//Eliminar una tarea
export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError("User not authenticated", 401);

    await taskService.deleteTask(userId, req.params.id);
    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
