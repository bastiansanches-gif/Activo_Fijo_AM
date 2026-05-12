import { z } from "zod";

const body = z.object({
  NombreEstado: z.string().min(1),
});

export const createEstadoActivoSchema = z.object({ body });
export const updateEstadoActivoSchema = z.object({ body: body.partial() });
