import { createService } from "../../shared/utils/crud";
import { usuariosRepository } from "./usuarios.repository";

export const usuariosService = createService(usuariosRepository);
