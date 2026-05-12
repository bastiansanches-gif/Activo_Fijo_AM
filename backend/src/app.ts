import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { dimensionesRoutes } from "./modules/dimensiones/dimensiones.routes";
import { usuariosRoutes } from "./modules/usuarios/usuarios.routes";
import { cuentaRoutes } from "./modules/cuenta/cuenta.routes";
import { cargosRoutes } from "./modules/cargos/cargos.routes";
import { marcasRoutes } from "./modules/marcas/marcas.routes";
import { modelosRoutes } from "./modules/modelos/modelos.routes";
import { procesadoresRoutes } from "./modules/procesadores/procesadores.routes";
import { discosDurosRoutes } from "./modules/discos-duros/discos-duros.routes";
import { estadosActivoRoutes } from "./modules/estados-activo/estados-activo.routes";
import { activoFijoRoutes } from "./modules/activo-fijo/activo-fijo.routes";
import { movimientosActivoFijoRoutes } from "./modules/movimientos-activo-fijo/movimientos-activo-fijo.routes";
import { checklistRoutes } from "./modules/checklist/checklist.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "API disponible", data: { service: "Audiomusica Asset Management" } });
});

app.use("/api/dimensiones", dimensionesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/cuentas", cuentaRoutes);
app.use("/api/cargos", cargosRoutes);
app.use("/api/marcas", marcasRoutes);
app.use("/api/modelos", modelosRoutes);
app.use("/api/procesadores", procesadoresRoutes);
app.use("/api/discos-duros", discosDurosRoutes);
app.use("/api/estados-activo", estadosActivoRoutes);
app.use("/api/activo-fijo", activoFijoRoutes);
app.use("/api/movimientos-activo-fijo", movimientosActivoFijoRoutes);
app.use("/api/checklist", checklistRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
