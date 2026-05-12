import { createController } from "../../shared/utils/crud";
import { modelosService } from "./modelos.service";

export const modelosController = createController(modelosService);
