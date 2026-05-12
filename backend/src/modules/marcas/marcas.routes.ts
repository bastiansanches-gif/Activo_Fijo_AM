import { createCrudRoutes } from "../../shared/utils/crud";
import { marcasController } from "./marcas.controller";
import { createMarcaSchema, updateMarcaSchema } from "./marcas.schema";

export const marcasRoutes = createCrudRoutes(marcasController, createMarcaSchema, updateMarcaSchema);
