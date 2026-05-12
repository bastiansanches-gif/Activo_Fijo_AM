import { createCrudRoutes } from "../../shared/utils/crud";
import { procesadoresController } from "./procesadores.controller";
import { createProcesadorSchema, updateProcesadorSchema } from "./procesadores.schema";

export const procesadoresRoutes = createCrudRoutes(procesadoresController, createProcesadorSchema, updateProcesadorSchema);
