import { prisma } from "../../config/prisma";
import { createRepository } from "../../shared/utils/crud";

export const procesadoresRepository = createRepository({
  delegate: prisma.procesadores,
  idField: "IdProcesador",
});
