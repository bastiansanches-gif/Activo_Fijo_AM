import { z } from "zod";

const body = z.object({
  NombreRol: z.string().min(1),
});

export const createCargoSchema = z.object({ body });
export const updateCargoSchema = z.object({ body: body.partial() });
