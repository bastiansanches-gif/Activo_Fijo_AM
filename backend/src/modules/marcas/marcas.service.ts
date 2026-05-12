import { createService } from "../../shared/utils/crud";
import { marcasRepository } from "./marcas.repository";

export const marcasService = createService(marcasRepository);
