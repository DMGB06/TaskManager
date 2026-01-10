import z from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Titulo es requerido").max(100, "Demasiado largo"),
    description: z.string().max(1000, "Description is too long"),
    priority: z.enum(["low", "medium", "high"]).optional(),
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
    dueDate: z.string().datetime().or(z.date()).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Titulo es requerido")
      .max(100, "Demasiado largo")
      .optional(),
    description: z.string().max(1000, "Description is too long").optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
    dueDate: z.string().datetime().or(z.date()).optional(),
  }),
});

export const getTasksQuerySchema = z.object({
  query: z.object({
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    completed: z.enum(["true", "false"]).optional(),
    page: z.string().regex(/^\d+$/).default("1").transform(Number),
    limit: z.string().regex(/^\d+$/).default("10").transform(Number),
  }),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema.shape.body>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema.shape.body>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema.shape.query>;
