import { prisma } from "../../config/prisma";
import { createRepository } from "../../shared/utils/crud";

export const usuariosRepository = createRepository({
  delegate: prisma.usuarios,
  idField: "IdUsuario",
  include: { Cargo: true, Dimension: true, Cuenta: true },
});
