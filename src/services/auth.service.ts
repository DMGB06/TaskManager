import User from "../models/user";
import {
  generateToken,
  refreshToken as generateRefreshToken,
} from "../utils/jwt";
import { AppError } from "../middlewares/errorHandler";
import {
  CreateUserDto,
  LoginUserDto,
  UpdateProfileUserDto,
} from "../schemas/user.schema";
import type mongoose from "mongoose";

type SanitizedUser = {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
};

type AuthResult = {
  user: SanitizedUser;
  accessToken: string;
  refreshToken?: string;
};

export class AuthService {
  async register(data: CreateUserDto): Promise<AuthResult> {
    const exist = await User.findOne({ email: data.email });
    if (exist) throw new AppError("Email already exist", 409);

    const userDoc = await User.create({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role ?? "user",
    });

    const accessToken = generateToken(userDoc._id.toString());
    const refreshToken = generateRefreshToken(userDoc._id.toString());

    userDoc.refreshToken = refreshToken;
    await userDoc.save();

    return {
      user: this.sanitize(userDoc._id, userDoc),
      accessToken,
      refreshToken,
    };
  }

  async login({ email, password }: LoginUserDto): Promise<AuthResult> {
    const userDoc = await User.findOne({ email }).select("+password");
    if (!userDoc) throw new AppError("Invalid credentials", 401);

    const ok = await userDoc.comparePassword(password);
    if (!ok) throw new AppError("Invalid credentials", 401);

    userDoc.lastLogin = new Date();

    const accessToken = generateToken(userDoc._id.toString());
    const refresh = generateRefreshToken(userDoc._id.toString());

    userDoc.refreshToken = refresh;
    await userDoc.save();
    return {
      user: this.sanitize(userDoc._id, userDoc),
      accessToken,
      refreshToken: refresh,
    };
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: "" } });
  }

  async me(userId: string): Promise<SanitizedUser> {
    const userDoc = await User.findById(userId);
    if (!userDoc) throw new AppError("User not found", 404);

    return this.sanitize(userDoc._id, userDoc);
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileUserDto
  ): Promise<SanitizedUser> {
    if (data.email) {
      const emailExists = await User.findOne({
        email: data.email,
        _id: { $ne: userId }, // Excluir el usuario actual
      });
      if (emailExists) {
        throw new AppError("Email already in use", 409);
      }
    }

    const updateData: any = {};
    if (data.username) updateData.username = data.username;
    if (data.email) updateData.email = data.email;

    //hasheo de contraseña
    if (data.password) updateData.password = data.password;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) throw new AppError("User not found", 404);
    return this.sanitize(user._id, user);
  }

  //Sanitzar los datos
  private sanitize(
    id: mongoose.Types.ObjectId | string,
    u: any
  ): SanitizedUser {
    return {
      id: typeof id === "string" ? id : id.toString(),
      username: u.username,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }
}

export default new AuthService();
