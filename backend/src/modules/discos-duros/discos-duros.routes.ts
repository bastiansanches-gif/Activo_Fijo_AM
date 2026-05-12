import { createCrudRoutes } from "../../shared/utils/crud";
import { discosDurosController } from "./discos-duros.controller";
import { createDiscoDuroSchema, updateDiscoDuroSchema } from "./discos-duros.schema";

export const discosDurosRoutes = createCrudRoutes(discosDurosController, createDiscoDuroSchema, updateDiscoDuroSchema);
