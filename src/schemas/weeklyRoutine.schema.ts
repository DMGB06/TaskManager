import z from "zod";

export const createWeeklyRoutineSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Very short title").max(100, "Very long title"),
    description: z.string().max(500, "Very long description").optional(),
    dayOfWeek: z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]),
    timeOfDay: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    category: z.string().max(50).optional(), // ← Cambiado de 500 a 50
  }),
});

export const updateWeeklyRoutineSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Very short title")
      .max(100, "Very long title")
      .optional(),
    description: z.string().max(500, "Very long description").optional(),
    dayOfWeek: z
      .enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ])
      .optional(),
    timeOfDay: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
      .optional(),
    isActive: z.boolean().optional(), // ← AGREGADO
    category: z.string().max(50).optional(), // ← Cambiado de 500 a 50
  }),
});

export const getWeeklyRoutinesQuerySchema = z.object({
  // ← Renombrado (plural)
  query: z.object({
    dayOfWeek: z
      .enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ])
      .optional(),
    isActive: z.enum(["true", "false"]).optional(),
    category: z.string().optional(),
  }),
});

// ← Nombres con PascalCase
export type CreateWeeklyRoutineDto = z.infer<
  typeof createWeeklyRoutineSchema.shape.body
>;
export type UpdateWeeklyRoutineDto = z.infer<
  typeof updateWeeklyRoutineSchema.shape.body
>;
export type GetWeeklyRoutinesQuery = z.infer<
  typeof getWeeklyRoutinesQuerySchema.shape.query
>;
