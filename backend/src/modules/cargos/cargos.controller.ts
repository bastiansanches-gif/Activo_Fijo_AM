import { createController } from "../../shared/utils/crud";
import { cargosService } from "./cargos.service";

export const cargosController = createController(cargosService);
