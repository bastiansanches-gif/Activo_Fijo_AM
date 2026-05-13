import { Router } from "express";
import { dimensionesController } from "./dimensiones.controller";

export const dimensionesRoutes = Router();

dimensionesRoutes.get("/", dimensionesController.findAll);
dimensionesRoutes.get("/:id", dimensionesController.findById);

// Escritura reservada para sincronizacion SAP/job interno futuro.
// No exponer POST/PUT/DELETE a usuarios del sistema.
