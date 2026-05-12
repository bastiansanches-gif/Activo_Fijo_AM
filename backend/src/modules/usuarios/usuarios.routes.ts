import { createCrudRoutes } from "../../shared/utils/crud";
import { usuariosController } from "./usuarios.controller";
import { createUsuarioSchema, updateUsuarioSchema } from "./usuarios.schema";

export const usuariosRoutes = createCrudRoutes(usuariosController, createUsuarioSchema, updateUsuarioSchema);
