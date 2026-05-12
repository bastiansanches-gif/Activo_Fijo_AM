import { z } from "zod";

const body = z.object({
  IdMarca: z.number().int().positive(),
  NombreModelo: z.string().min(1),
});

export const createModeloSchema = z.object({ body });
export const updateModeloSchema = z.object({ body: body.partial() });
