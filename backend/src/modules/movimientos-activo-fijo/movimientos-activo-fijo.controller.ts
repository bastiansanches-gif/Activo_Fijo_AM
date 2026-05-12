import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../shared/utils/api-response";
import { messages } from "../../shared/constants/messages";
import { movimientosActivoFijoService } from "./movimientos-activo-fijo.service";

export const movimientosActivoFijoController = {
  findAll: asyncHandler(async (_req, res) => sendSuccess(res, messages.listed, await movimientosActivoFijoService.findAll())),
  findById: asyncHandler(async (req, res) => sendSuccess(res, messages.found, await movimientosActivoFijoService.findById(Number(req.params.id)))),
  findByActivo: asyncHandler(async (req, res) => sendSuccess(res, messages.listed, await movimientosActivoFijoService.findByActivo(Number(req.params.idActivoFijo)))),
  create: asyncHandler(async (req, res) => sendSuccess(res, messages.created, await movimientosActivoFijoService.create(req.body), 201)),
};
