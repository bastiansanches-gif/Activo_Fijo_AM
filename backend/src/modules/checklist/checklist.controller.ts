import path from "path";
import { asyncHandler } from "../../shared/utils/async-handler";
import { createController } from "../../shared/utils/crud";
import { HttpError } from "../../shared/utils/http-error";
import { checklistService } from "./checklist.service";

export const checklistController = {
  ...createController(checklistService),

  // Descarga el archivo referenciado por Checklist sin registrar resultados por activo.
  download: asyncHandler(async (req, res) => {
    const checklist = (await checklistService.findById(Number(req.params.id))) as { RutaArchivo: string; NombreArchivo: string };
    const filePath = path.resolve(checklist.RutaArchivo);

    return res.download(filePath, checklist.NombreArchivo, (error) => {
      if (error && !res.headersSent) {
        throw new HttpError(404, "Archivo de checklist no encontrado", error.message);
      }
    });
  }),
};
