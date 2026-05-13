import { apiClient } from "./apiClient";

export type LicenciaApi = {
  idLicencia?: number;
  IdLicencia?: number;
  nombreLicencia?: string;
  NombreLicencia?: string;
};

export type UsuarioLicenciaApi = {
  idUsuarioLicencia?: number;
  IdUsuarioLicencia?: number;
  idUsuario?: number;
  IdUsuario?: number;
  idLicencia?: number;
  IdLicencia?: number;
};

export const licenciasService = {
  list: () => apiClient<LicenciaApi[]>("/licencias"),
  listByUsuario: () => apiClient<UsuarioLicenciaApi[]>("/usuario-licencias"),
  assign: (idUsuario: number, idLicencia: number) =>
    apiClient<UsuarioLicenciaApi>("/usuario-licencias", {
      method: "POST",
      body: JSON.stringify({ IdUsuario: idUsuario, IdLicencia: idLicencia }),
    }),
  unassign: (idUsuarioLicencia: number) => apiClient<void>(`/usuario-licencias/${idUsuarioLicencia}`, { method: "DELETE" }),
};
