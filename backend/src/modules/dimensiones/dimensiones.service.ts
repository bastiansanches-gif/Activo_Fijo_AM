import { createService } from "../../shared/utils/crud";
import { dimensionesRepository } from "./dimensiones.repository";

export const dimensionesService = createService(dimensionesRepository);
