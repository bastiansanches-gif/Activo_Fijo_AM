import { z } from "zod";

const nullableDate = z.coerce.date().nullable().optional();

const body = z.object({
  NombreUsuario: z.string().min(1),
  ApellidoPaterno: z.string().min(1),
  ApellidoMaterno: z.string().min(1).nullable().optional(),
  FechaIngreso: z.coerce.date(),
  FinContrato: nullableDate,
  IdCargo: z.number().int().positive(),
  IdDimension: z.number().int().positive(),
  Activo: z.boolean().optional(),
  IdCuenta: z.number().int().positive().nullable().optional(),
});

export const createUsuarioSchema = z.object({ body });
export const updateUsuarioSchema = z.object({ body: body.partial() });
