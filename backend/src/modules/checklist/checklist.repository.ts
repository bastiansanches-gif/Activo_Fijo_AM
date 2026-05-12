import { prisma } from "../../config/prisma";
import { createRepository } from "../../shared/utils/crud";

export const checklistRepository = createRepository({
  delegate: prisma.checklist,
  idField: "IdChecklist",
});
