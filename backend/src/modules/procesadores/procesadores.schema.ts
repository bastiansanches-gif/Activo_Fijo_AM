import { z } from "zod";

const body = z.object({
  NombreProcesador: z.string().min(1),
});

export const createProcesadorSchema = z.object({ body });
export const updateProcesadorSchema = z.object({ body: body.partial() });
