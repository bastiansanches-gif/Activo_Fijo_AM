import { apiClient } from "./apiClient";

export type Dimension = {
  idDimension: number;
  IdDimension?: number;
  numeroDimension: string;
  NumeroDimension?: string;
  nombreDimension: string;
  NombreDimension?: string;
  pais?: string;
  Pais?: string;
  area?: string;
  Area?: string;
  subArea?: string;
  SubArea?: string;
  activo: boolean;
  Activo?: boolean;
};

export const dimensionesService = {
  list: () => apiClient<Dimension[]>("/dimensiones"),
  getById: (id: number) => apiClient<Dimension>(`/dimensiones/${id}`),
};
