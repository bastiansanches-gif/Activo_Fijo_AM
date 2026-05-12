import { z } from "zod";

const body = z.object({
  NombreCuenta: z.string().min(1),
});

export const createCuentaSchema = z.object({ body });
export const updateCuentaSchema = z.object({ body: body.partial() });
