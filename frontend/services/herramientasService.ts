import { apiClient } from "./apiClient";

export type Herramienta = {
  idHerramienta: number;
  nombreHerramienta: string;
  tipoHerramienta: string;
  marca?: string | null;
  modelo?: string | null;
  serial?: string | null;
  cantidad: number;
  idDimension?: number | null;
  estado: string;
  detalles?: string | null;
  fechaRegistro: string;
  activo: boolean;
};

export const herramientasService = {
  list: () => apiClient<Herramienta[]>("/herramientas"),
  create: (payload: Partial<Herramienta>) => apiClient<Herramienta>("/herramientas", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: Partial<Herramienta>) => apiClient<Herramienta>(`/herramientas/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => apiClient<void>(`/herramientas/${id}`, { method: "DELETE" }),
  byDimension: (idDimension: number) => apiClient<Herramienta[]>(`/herramientas/dimension/${idDimension}`),
  byEstado: (estado: string) => apiClient<Herramienta[]>(`/herramientas/estado/${encodeURIComponent(estado)}`),
};
