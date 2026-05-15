import { apiClient } from "./apiClient";

export type LicenciaApi = {
  idCuenta?: number;
  IdCuenta?: number;
  nombreCuenta?: string;
  NombreCuenta?: string;
};

export type UsuarioLicenciaApi = {
  idUsuarioCuenta?: number;
  IdUsuarioCuenta?: number;
  idUsuario?: number;
  IdUsuario?: number;
  idCuenta?: number;
  IdCuenta?: number;
};

export const licenciasService = {
  list: () => apiClient<LicenciaApi[]>("/cuentas"),
  listByUsuario: () => apiClient<UsuarioLicenciaApi[]>("/usuario-cuentas"),
  assign: (idUsuario: number, idCuenta: number) =>
    apiClient<UsuarioLicenciaApi>("/usuario-cuentas", {
      method: "POST",
      body: JSON.stringify({ IdUsuario: idUsuario, IdCuenta: idCuenta }),
    }),
  unassign: (idUsuarioCuenta: number) => apiClient<void>(`/usuario-cuentas/${idUsuarioCuenta}`, { method: "DELETE" }),
};
