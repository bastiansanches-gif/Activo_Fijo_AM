import { createController } from "../../shared/utils/crud";
import { marcasService } from "./marcas.service";

export const marcasController = createController(marcasService);
