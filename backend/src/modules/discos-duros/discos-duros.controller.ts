import { createController } from "../../shared/utils/crud";
import { discosDurosService } from "./discos-duros.service";

export const discosDurosController = createController(discosDurosService);
