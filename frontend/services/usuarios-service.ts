import { apiClient } from "./apiClient";

export type UsuarioApi = {
  idUsuario: number;
  nombreUsuario: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  fechaIngreso: string;
  finContrato?: string | null;
  idRol: number;
  idDimension: number;
  activo: boolean;
  idCuenta?: number | null;
};

export const usuariosService = {
  list: () => apiClient<UsuarioApi[]>("/usuarios"),
  create: (payload: Partial<UsuarioApi>) => apiClient<UsuarioApi>("/usuarios", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: Partial<UsuarioApi>) => apiClient<UsuarioApi>(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => apiClient<void>(`/usuarios/${id}`, { method: "DELETE" }),
};
