import {z} from "zod";

export const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(50),
        email: z.string().email({message: "Invalid email address"}),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        role: z.enum(["user","admin"]).optional(),
    }),
});

export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email({message: "Invalid email address"}),
        password: z.string().min(1, "Password is required"),
    }),
});

export const updateUserSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(50).optional(),
        email: z.string().email({message: "Invalid email address"}).optional(),
        password: z.string().min(6, "Password must be at least 6 characters long").optional(),
        role: z.enum(["user","admin"]).optional(),
        isActive: z.boolean().optional(),
    })
});

// Tipos inferidos (NUEVO)
export type CreateUserDto = z.infer<typeof createUserSchema.shape.body>;
export type LoginUserDto = z.infer<typeof loginUserSchema.shape.body>;
export type UpdateUserDto = z.infer<typeof updateUserSchema.shape.body>;