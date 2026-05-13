import { apiClient } from "./apiClient";

export type UsuarioApi = {
  idUsuario: number;
  IdUsuario?: number;
  rut?: string;
  Rut?: string;
  nombreUsuario: string;
  NombreUsuario?: string;
  apellidoPaterno: string;
  ApellidoPaterno?: string;
  apellidoMaterno?: string | null;
  ApellidoMaterno?: string | null;
  correoCorporativo?: string;
  CorreoCorporativo?: string;
  cargoTexto?: string;
  Cargo?: string | { nombreRol?: string; NombreRol?: string } | null;
  cargo?: string | { nombreRol?: string; NombreRol?: string } | null;
  CargoNombre?: string;
  cargoNombre?: string;
  fechaIngreso: string;
  FechaIngreso?: string;
  idCargo?: number;
  IdCargo?: number;
  finContrato?: string | null;
  idRol: number;
  IdRol?: number;
  idDimension: number;
  IdDimension?: number;
  activo: boolean;
  Activo?: boolean;
  idCuenta?: number | null;
  IdCuenta?: number | null;
  cuenta?: { nombreCuenta?: string; NombreCuenta?: string } | null;
  Cuenta?: { nombreCuenta?: string; NombreCuenta?: string } | null;
  rol?: { nombreRol?: string; NombreRol?: string } | null;
  Rol?: { nombreRol?: string; NombreRol?: string } | null;
  dimension?: { numeroDimension?: string; NumeroDimension?: string; nombreDimension?: string; NombreDimension?: string } | null;
  Dimension?: { numeroDimension?: string; NumeroDimension?: string; nombreDimension?: string; NombreDimension?: string } | null;
  usuarioLicencias?: Array<{ idLicencia?: number; IdLicencia?: number; licencia?: { nombreLicencia?: string; NombreLicencia?: string } | null; Licencia?: { nombreLicencia?: string; NombreLicencia?: string } | null }>;
  UsuarioLicencias?: Array<{ idLicencia?: number; IdLicencia?: number; licencia?: { nombreLicencia?: string; NombreLicencia?: string } | null; Licencia?: { nombreLicencia?: string; NombreLicencia?: string } | null }>;
};

export const usuariosService = {
  list: () => apiClient<UsuarioApi[]>("/usuarios"),
  create: (payload: Partial<UsuarioApi>) => apiClient<UsuarioApi>("/usuarios", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: Partial<UsuarioApi>) => apiClient<UsuarioApi>(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => apiClient<void>(`/usuarios/${id}`, { method: "DELETE" }),
};
