import { Request, Response } from "express";
import { sendError } from "../shared/utils/api-response";

export function notFoundMiddleware(req: Request, res: Response) {
  return sendError(res, `Ruta no encontrada: ${req.method} ${req.originalUrl}`, null, 404);
}
