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
  fechaIngreso: string;
  FechaIngreso?: string;
  finContrato?: string | null;
  FinContrato?: string | null;
  idRol: number;
  IdRol?: number;
  idDimension: number;
  IdDimension?: number;
  activo: boolean;
  Activo?: boolean;
  idCuentas?: number[];
  IdCuentas?: number[];
  cuentas?: Array<{ idCuenta?: number; IdCuenta?: number; nombreCuenta?: string; NombreCuenta?: string }>;
  Cuentas?: Array<{ idCuenta?: number; IdCuenta?: number; nombreCuenta?: string; NombreCuenta?: string }>;
  rol?: { nombreRol?: string; NombreRol?: string } | null;
  Rol?: { nombreRol?: string; NombreRol?: string } | null;
  dimension?: { numeroDimension?: string; NumeroDimension?: string; nombreDimension?: string; NombreDimension?: string } | null;
  Dimension?: { numeroDimension?: string; NumeroDimension?: string; nombreDimension?: string; NombreDimension?: string } | null;
};

export const usuariosService = {
  list: () => apiClient<UsuarioApi[]>("/usuarios"),
  create: (payload: Partial<UsuarioApi>) => apiClient<UsuarioApi>("/usuarios", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: Partial<UsuarioApi>) => apiClient<UsuarioApi>(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => apiClient<void>(`/usuarios/${id}`, { method: "DELETE" }),
};
