import { createCrudRoutes } from "../../shared/utils/crud";
import { modelosController } from "./modelos.controller";
import { createModeloSchema, updateModeloSchema } from "./modelos.schema";

export const modelosRoutes = createCrudRoutes(modelosController, createModeloSchema, updateModeloSchema);
