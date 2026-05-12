import { apiClient } from "./apiClient";

export type Dimension = {
  idDimension: number;
  numeroDimension: string;
  nombreDimension: string;
  activo: boolean;
};

export const dimensionesService = {
  list: () => apiClient<Dimension[]>("/dimensiones"),
  create: (payload: Partial<Dimension>) => apiClient<Dimension>("/dimensiones", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: Partial<Dimension>) => apiClient<Dimension>(`/dimensiones/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => apiClient<void>(`/dimensiones/${id}`, { method: "DELETE" }),
};
