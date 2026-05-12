import { Response } from "express";

export function sendSuccess<T>(res: Response, message: string, data?: T, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
}

export function sendError(res: Response, message: string, error?: unknown, statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error ?? null,
  });
}
