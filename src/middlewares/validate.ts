import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //guardamos en una variable
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    //Si esta correcto si termina la ejecucion con un next
    if (result.success) {
      return next();
    }

    //Guardar los errores en una variable
    const errors = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  };
};
