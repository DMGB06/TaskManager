import User, { IUser } from "../models/user";
import { AppError } from "../middlewares/errorHandler";
import { AdminUpdateUserDto } from "../schemas/user.schema";
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

export class AdminService {
  //Listar usuarios
  async getAllUsers(): Promise<SanitizedUser[]> {
    const users = await User.find().sort({ createdAt: -1 });
    return users.map((user) => this.sanitize(user._id, user));
  }

  async getUserById(userId: string): Promise<SanitizedUser> {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    return this.sanitize(user._id, user);
  }

  async updateUser(
    userId: string,
    data: AdminUpdateUserDto
  ): Promise<SanitizedUser> {
    if (data.email) {
      const emailExists = await User.findOne({
        email: data.email,
        _id: { $ne: userId },
      });
      if (emailExists) {
        throw new AppError("Email already use", 409);
      }
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    if (!user) throw new AppError("User not found", 404);
    return this.sanitize(user._id, user);
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new AppError("User not found", 404);
  }

  private sanitize(
    id: mongoose.Types.ObjectId | string,
    u: IUser  
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

export default new AdminService();
