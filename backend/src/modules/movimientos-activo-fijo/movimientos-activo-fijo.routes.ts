import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { movimientosActivoFijoController } from "./movimientos-activo-fijo.controller";
import { createMovimientoActivoFijoSchema, idActivoFijoParamSchema, idParamSchema } from "./movimientos-activo-fijo.schema";

export const movimientosActivoFijoRoutes = Router();

movimientosActivoFijoRoutes.get("/", movimientosActivoFijoController.findAll);
movimientosActivoFijoRoutes.get("/activo/:idActivoFijo", validate(idActivoFijoParamSchema), movimientosActivoFijoController.findByActivo);
movimientosActivoFijoRoutes.get("/:id", validate(idParamSchema), movimientosActivoFijoController.findById);
movimientosActivoFijoRoutes.post("/", validate(createMovimientoActivoFijoSchema), movimientosActivoFijoController.create);
