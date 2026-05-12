import { prisma } from "../../config/prisma";
import { createRepository } from "../../shared/utils/crud";

export const discosDurosRepository = createRepository({
  delegate: prisma.discosDuros,
  idField: "IdDiscoDuro",
});
