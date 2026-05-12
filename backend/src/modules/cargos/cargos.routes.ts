import { createCrudRoutes } from "../../shared/utils/crud";
import { cargosController } from "./cargos.controller";
import { createCargoSchema, updateCargoSchema } from "./cargos.schema";

export const cargosRoutes = createCrudRoutes(cargosController, createCargoSchema, updateCargoSchema);
