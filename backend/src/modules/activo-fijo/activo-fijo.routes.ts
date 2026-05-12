import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { activoFijoController } from "./activo-fijo.controller";
import {
  createActivoFijoSchema,
  idDimensionParamSchema,
  idEstadoActivoParamSchema,
  idParamSchema,
  idUsuarioParamSchema,
  serialParamSchema,
  updateActivoFijoSchema,
} from "./activo-fijo.schema";

export const activoFijoRoutes = Router();

activoFijoRoutes.get("/", activoFijoController.findAll);
activoFijoRoutes.get("/serial/:serial", validate(serialParamSchema), activoFijoController.findBySerial);
activoFijoRoutes.get("/dimension/:idDimension", validate(idDimensionParamSchema), activoFijoController.findByDimension);
activoFijoRoutes.get("/usuario/:idUsuario", validate(idUsuarioParamSchema), activoFijoController.findByUsuario);
activoFijoRoutes.get("/estado/:idEstadoActivo", validate(idEstadoActivoParamSchema), activoFijoController.findByEstado);
activoFijoRoutes.get("/:id", validate(idParamSchema), activoFijoController.findById);
activoFijoRoutes.post("/", validate(createActivoFijoSchema), activoFijoController.create);
activoFijoRoutes.put("/:id", validate(idParamSchema.merge(updateActivoFijoSchema)), activoFijoController.update);
activoFijoRoutes.delete("/:id", validate(idParamSchema), activoFijoController.delete);
