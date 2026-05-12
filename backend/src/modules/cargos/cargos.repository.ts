import { prisma } from "../../config/prisma";
import { createRepository } from "../../shared/utils/crud";

export const cargosRepository = createRepository({
  delegate: prisma.cargos,
  idField: "IdRol",
});
