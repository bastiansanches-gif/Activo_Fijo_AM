import { apiClient } from "./apiClient";

export type DashboardSummary = {
  activosTotales: number;
  activosDisponibles: number;
  usuariosActivos: number;
  herramientasActivas: number;
  movimientosRegistrados: number;
  checklists: number;
};

export const dashboardService = {
  summary: () => apiClient<DashboardSummary>("/dashboard/resumen"),
};
