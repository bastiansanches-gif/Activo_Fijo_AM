import { createController } from "../../shared/utils/crud";
import { cuentaService } from "./cuenta.service";

export const cuentaController = createController(cuentaService);
