import { z } from "zod";

const body = z.object({
  NumeroDimension: z.string().min(1),
  NombreDimension: z.string().min(1),
  Activo: z.boolean().optional(),
});

export const createDimensionSchema = z.object({ body });
export const updateDimensionSchema = z.object({ body: body.partial() });
