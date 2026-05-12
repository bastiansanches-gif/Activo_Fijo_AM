import { createController } from "../../shared/utils/crud";
import { procesadoresService } from "./procesadores.service";

export const procesadoresController = createController(procesadoresService);
