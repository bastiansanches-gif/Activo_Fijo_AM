import { asyncHandler } from "../../shared/utils/async-handler";
import { sendSuccess } from "../../shared/utils/api-response";
import { messages } from "../../shared/constants/messages";
import { activoFijoService } from "./activo-fijo.service";

export const activoFijoController = {
  findAll: asyncHandler(async (_req, res) => sendSuccess(res, messages.listed, await activoFijoService.findAll())),
  findById: asyncHandler(async (req, res) => sendSuccess(res, messages.found, await activoFijoService.findById(Number(req.params.id)))),
  findBySerial: asyncHandler(async (req, res) => sendSuccess(res, messages.found, await activoFijoService.findBySerial(req.params.serial))),
  findByDimension: asyncHandler(async (req, res) => sendSuccess(res, messages.listed, await activoFijoService.findByDimension(Number(req.params.idDimension)))),
  findByUsuario: asyncHandler(async (req, res) => sendSuccess(res, messages.listed, await activoFijoService.findByUsuario(Number(req.params.idUsuario)))),
  findByEstado: asyncHandler(async (req, res) => sendSuccess(res, messages.listed, await activoFijoService.findByEstado(Number(req.params.idEstadoActivo)))),
  create: asyncHandler(async (req, res) => sendSuccess(res, messages.created, await activoFijoService.create(req.body), 201)),
  update: asyncHandler(async (req, res) => sendSuccess(res, messages.updated, await activoFijoService.update(Number(req.params.id), req.body))),
  delete: asyncHandler(async (req, res) => sendSuccess(res, messages.deleted, await activoFijoService.delete(Number(req.params.id)))),
};
