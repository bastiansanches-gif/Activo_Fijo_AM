import { createController } from "../../shared/utils/crud";
import { estadosActivoService } from "./estados-activo.service";

export const estadosActivoController = createController(estadosActivoService);
