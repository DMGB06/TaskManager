import z from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Titulo es requerido").max(100, "Demasiado largo"),
    description: z.string().max(1000, "Description is too long"),
    priority: z.enum(["low", "medium", "high"]).optional(),
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
    completed: z.boolean().optional(),
    dueDate: z.string().datetime().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Titulo es requerido").max(100, "Demasiado largo"),
    description: z.string().max(1000, "Description is too long"),
    priority: z.enum(["low", "medium", "hight"]).optional(),
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
    completed: z.boolean().optional(),
    dueDate: z.string().datetime().optional(),
  }),
});

export const getTasksQuerySchema = z.object({
  query: z.object({
    status: z.enum(["pending", "in-progress", "completed"]),
    priority: z.enum(["low", "medium", "hight"]),
    completed: z.enum(["true", "false"]),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema.shape.body>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema.shape.body>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema.shape.query>;
