import { createService } from "../../shared/utils/crud";
import { cargosRepository } from "./cargos.repository";

export const cargosService = createService(cargosRepository);
