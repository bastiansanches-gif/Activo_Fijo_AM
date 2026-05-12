import { createService } from "../../shared/utils/crud";
import { cuentaRepository } from "./cuenta.repository";

export const cuentaService = createService(cuentaRepository);
