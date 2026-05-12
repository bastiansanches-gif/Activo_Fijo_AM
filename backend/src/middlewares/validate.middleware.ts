import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

// Valida body, params y query antes de entrar al controller.
export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      req.body = parsed.body ?? req.body;
      req.params = parsed.params ?? req.params;
      req.query = parsed.query ?? req.query;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function formatZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}
