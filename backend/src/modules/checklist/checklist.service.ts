import { createService } from "../../shared/utils/crud";
import { checklistRepository } from "./checklist.repository";

export const checklistService = createService(checklistRepository);
