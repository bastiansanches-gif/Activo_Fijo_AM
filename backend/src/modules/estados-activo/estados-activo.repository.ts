import { prisma } from "../../config/prisma";
import { createRepository } from "../../shared/utils/crud";

export const estadosActivoRepository = createRepository({
  delegate: prisma.estadosActivo,
  idField: "IdEstadoActivo",
});
