import { createController } from "../../shared/utils/crud";
import { dimensionesService } from "./dimensiones.service";

export const dimensionesController = createController(dimensionesService);
