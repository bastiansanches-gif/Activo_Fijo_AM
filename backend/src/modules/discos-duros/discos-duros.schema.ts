import { z } from "zod";

const body = z.object({
  TipoDisco: z.string().min(1),
  CapacidadGB: z.number().int().positive(),
  Descripcion: z.string().min(1),
});

export const createDiscoDuroSchema = z.object({ body });
export const updateDiscoDuroSchema = z.object({ body: body.partial() });
