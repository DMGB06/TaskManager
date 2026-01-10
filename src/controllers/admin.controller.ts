import { Request, Response, NextFunction } from "express";
import adminService from "../services/admin.service";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await adminService.getAllUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    res.json({
      success: true,
      data: user,
      message: "User updated succesfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
