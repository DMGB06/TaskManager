import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import { AppError } from "../middlewares/errorHandler";

//Extender el request para tipar el req.user

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

//controlador para registrar
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//controlador para logear
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.login(req.body);
    res.json({
      success: true,
      message: "Login succesfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//logout

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    await authService.logout(req.user.id);

    res.json({
      success: true,
      message: "Logout Succesfully",
    });
  } catch (error) {
    next(error);
  }
};

//Perfil

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await authService.me(req.user.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if(!userId) throw new AppError("User not found", 404)

    const user = await authService.updateProfile(userId, req.body);
    res.json({
      success: true, 
      data: user,
      message: "Profile update succesfully"
    })

  } catch (error) {
    next(error);
  }
}