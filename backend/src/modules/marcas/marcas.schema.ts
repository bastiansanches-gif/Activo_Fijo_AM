import { z } from "zod";

const body = z.object({
  NombreMarca: z.string().min(1),
});

export const createMarcaSchema = z.object({ body });
export const updateMarcaSchema = z.object({ body: body.partial() });
