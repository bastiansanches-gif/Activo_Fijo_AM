import { createService } from "../../shared/utils/crud";
import { modelosRepository } from "./modelos.repository";

export const modelosService = createService(modelosRepository);
