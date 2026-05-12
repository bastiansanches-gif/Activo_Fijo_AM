import { createController } from "../../shared/utils/crud";
import { usuariosService } from "./usuarios.service";

export const usuariosController = createController(usuariosService);
