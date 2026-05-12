import { createCrudRoutes } from "../../shared/utils/crud";
import { estadosActivoController } from "./estados-activo.controller";
import { createEstadoActivoSchema, updateEstadoActivoSchema } from "./estados-activo.schema";

export const estadosActivoRoutes = createCrudRoutes(estadosActivoController, createEstadoActivoSchema, updateEstadoActivoSchema);
