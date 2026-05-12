import { createService } from "../../shared/utils/crud";
import { discosDurosRepository } from "./discos-duros.repository";

export const discosDurosService = createService(discosDurosRepository);
