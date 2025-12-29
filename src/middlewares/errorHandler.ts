// Backend/src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isDev = process.env.NODE_ENV !== "production";

  // Zod validation error
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(isDev && { stack: err.stack }),
    });
  }

  // Mongo duplicate key error
  if (isMongoDuplicateError(err)) {
    return res.status(409).json({
      success: false,
      message: "Duplicate key error",
      detail: getDuplicateKeyDetail(err),
    });
  }

  // Mongoose validation error
  if (isMongooseValidationError(err)) {
    return res.status(400).json({
      success: false,
      message: "Database validation failed",
      errors: formatMongooseValidation(err),
    });
  }

  // JWT errors
  if (isJwtError(err)) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // Fallback unknown error
  const message =
    typeof err === "object" && err && "message" in err
      ? String((err as any).message)
      : "Internal server error";

  return res.status(500).json({
    success: false,
    message,
    ...(isDev && { stack: (err as any)?.stack }),
  });
};

// Type guards and helpers
function isMongoDuplicateError(
  err: unknown
): err is { code: number; keyValue?: Record<string, unknown> } {
  return typeof err === "object" && !!err && (err as any).code === 11000;
}
function getDuplicateKeyDetail(err: { keyValue?: Record<string, unknown> }) {
  return err.keyValue ?? undefined;
}
function isMongooseValidationError(
  err: unknown
): err is { name: string; errors: Record<string, { message: string }> } {
  return (
    typeof err === "object" && !!err && (err as any).name === "ValidationError"
  );
}
function formatMongooseValidation(err: {
  errors: Record<string, { message: string }>;
}) {
  return Object.entries(err.errors).map(([field, detail]) => ({
    path: field,
    message: detail.message,
  }));
}
function isJwtError(err: unknown): boolean {
  const name = (err as any)?.name;
  return name === "JsonWebTokenError" || name === "TokenExpiredError";
}
