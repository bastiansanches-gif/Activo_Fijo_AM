import { prisma } from "../../config/prisma";
import { createRepository } from "../../shared/utils/crud";

export const marcasRepository = createRepository({
  delegate: prisma.marcas,
  idField: "IdMarca",
});
