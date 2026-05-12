import { createService } from "../../shared/utils/crud";
import { estadosActivoRepository } from "./estados-activo.repository";

export const estadosActivoService = createService(estadosActivoRepository);
