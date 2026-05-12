import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { checklistController } from "./checklist.controller";
import { createChecklistSchema, idParamSchema, updateChecklistSchema } from "./checklist.schema";

export const checklistRoutes = Router();

checklistRoutes.get("/", checklistController.findAll);
checklistRoutes.get("/:id/download", validate(idParamSchema), checklistController.download);
checklistRoutes.get("/:id", validate(idParamSchema), checklistController.findById);
checklistRoutes.post("/", validate(createChecklistSchema), checklistController.create);
checklistRoutes.put("/:id", validate(idParamSchema.merge(updateChecklistSchema)), checklistController.update);
checklistRoutes.delete("/:id", validate(idParamSchema), checklistController.delete);
