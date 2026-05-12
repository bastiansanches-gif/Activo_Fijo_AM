import { createService } from "../../shared/utils/crud";
import { procesadoresRepository } from "./procesadores.repository";

export const procesadoresService = createService(procesadoresRepository);
