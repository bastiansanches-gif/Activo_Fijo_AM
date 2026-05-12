import { NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { sendError } from "../shared/utils/api-response";
import { HttpError } from "../shared/utils/http-error";
import { formatZodError } from "./validate.middleware";
import { logger } from "../config/logger";

// Middleware global para normalizar errores de negocio, Prisma y validacion.
export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return sendError(res, "Error de validacion", formatZodError(error), 400);
  }

  if (error instanceof HttpError) {
    return sendError(res, error.message, error.details, error.statusCode);
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") return sendError(res, "Registro duplicado", error.meta, 409);
    if (error.code === "P2003") return sendError(res, "Referencia relacionada no existe", error.meta, 400);
    if (error.code === "P2025") return sendError(res, "Recurso no encontrado", error.meta, 404);
  }

  logger.error("Error no controlado", error);
  return sendError(res, "Error interno del servidor", error instanceof Error ? error.message : error, 500);
}
