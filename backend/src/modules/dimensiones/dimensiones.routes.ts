import { createCrudRoutes } from "../../shared/utils/crud";
import { dimensionesController } from "./dimensiones.controller";
import { createDimensionSchema, updateDimensionSchema } from "./dimensiones.schema";

export const dimensionesRoutes = createCrudRoutes(dimensionesController, createDimensionSchema, updateDimensionSchema);
