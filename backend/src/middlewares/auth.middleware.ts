import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "../shared/utils/http-error";

export type JwtPayload = {
  sub: string;
  role?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Token JWT requerido"));
  }

  try {
    req.user = jwt.verify(header.slice(7), env.JWT_SECRET) as JwtPayload;
    return next();
  } catch {
    return next(new HttpError(401, "Token JWT invalido"));
  }
}
