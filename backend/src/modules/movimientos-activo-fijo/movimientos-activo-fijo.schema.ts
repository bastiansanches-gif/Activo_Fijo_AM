import { z } from "zod";

const body = z.object({
  IdActivoFijo: z.number().int().positive(),
  IdDimensionAnterior: z.number().int().positive(),
  IdDimensionNueva: z.number().int().positive(),
  IdUsuarioAnterior: z.number().int().positive().nullable().optional(),
  IdUsuarioNuevo: z.number().int().positive().nullable().optional(),
  FechaMovimiento: z.coerce.date().optional(),
  Observacion: z.string().min(1).nullable().optional(),
});

export const createMovimientoActivoFijoSchema = z.object({ body });
export const idParamSchema = z.object({ params: z.object({ id: z.coerce.number().int().positive() }) });
export const idActivoFijoParamSchema = z.object({ params: z.object({ idActivoFijo: z.coerce.number().int().positive() }) });
