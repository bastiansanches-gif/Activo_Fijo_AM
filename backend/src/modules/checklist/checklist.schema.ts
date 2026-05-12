import { z } from "zod";

const body = z.object({
  NombreChecklist: z.string().min(1),
  TipoChecklist: z.string().min(1).nullable().optional(),
  NombreArchivo: z.string().min(1),
  RutaArchivo: z.string().min(1),
  ExtensionArchivo: z.string().min(1),
  FechaCreacion: z.coerce.date().optional(),
});

export const createChecklistSchema = z.object({ body });
export const updateChecklistSchema = z.object({ body: body.partial() });
export const idParamSchema = z.object({ params: z.object({ id: z.coerce.number().int().positive() }) });
