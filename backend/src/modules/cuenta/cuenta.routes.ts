import { createCrudRoutes } from "../../shared/utils/crud";
import { cuentaController } from "./cuenta.controller";
import { createCuentaSchema, updateCuentaSchema } from "./cuenta.schema";

export const cuentaRoutes = createCrudRoutes(cuentaController, createCuentaSchema, updateCuentaSchema);
