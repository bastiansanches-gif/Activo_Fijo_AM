import { prisma } from "../../config/prisma";
import { createRepository } from "../../shared/utils/crud";

export const modelosRepository = createRepository({
  delegate: prisma.modelos,
  idField: "IdModelo",
  include: { Marca: true },
});
