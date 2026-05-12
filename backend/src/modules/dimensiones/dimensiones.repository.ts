import { prisma } from "../../config/prisma";
import { createRepository } from "../../shared/utils/crud";

export const dimensionesRepository = createRepository({
  delegate: prisma.dimensiones,
  idField: "IdDimension",
});
