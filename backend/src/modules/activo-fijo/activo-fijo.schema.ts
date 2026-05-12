import { z } from "zod";

const nullablePositiveInt = z.number().int().positive().nullable().optional();

const body = z.object({
  IdDimension: z.number().int().positive(),
  IdUsuario: nullablePositiveInt,
  RAM: z.string().min(1).nullable().optional(),
  IdMarca: z.number().int().positive(),
  IdModelo: z.number().int().positive(),
  IdProcesador: nullablePositiveInt,
  IdDiscoDuro: nullablePositiveInt,
  Serial: z.string().min(1),
  NumeroFactura: z.string().min(1).nullable().optional(),
  RutProveedor: z.string().min(1).nullable().optional(),
  FechaCompra: z.coerce.date().nullable().optional(),
  Detalles: z.string().min(1).nullable().optional(),
  EsAF: z.boolean(),
  IdEstadoActivo: z.number().int().positive(),
});

export const createActivoFijoSchema = z.object({ body });
export const updateActivoFijoSchema = z.object({ body: body.partial() });
export const idParamSchema = z.object({ params: z.object({ id: z.coerce.number().int().positive() }) });
export const idDimensionParamSchema = z.object({ params: z.object({ idDimension: z.coerce.number().int().positive() }) });
export const idUsuarioParamSchema = z.object({ params: z.object({ idUsuario: z.coerce.number().int().positive() }) });
export const idEstadoActivoParamSchema = z.object({ params: z.object({ idEstadoActivo: z.coerce.number().int().positive() }) });
export const serialParamSchema = z.object({ params: z.object({ serial: z.string().min(1) }) });
