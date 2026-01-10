import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(50),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["user", "admin"]).optional(),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, "Password is required"),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(50).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(), // Esto para cambiar la contraseña
  }),
});

export const adminUpdateUserSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(50).optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    role: z.enum(["user", "admin"]).optional(),
    isActive: z.boolean().optional(),
  }),
});

// Tipos inferidos
export type CreateUserDto = z.infer<typeof createUserSchema.shape.body>;
export type LoginUserDto = z.infer<typeof loginUserSchema.shape.body>;
export type AdminUpdateUserDto = z.infer<typeof adminUpdateUserSchema.shape.body>;
export type UpdateProfileUserDto = z.infer<typeof updateProfileSchema.shape.body>;