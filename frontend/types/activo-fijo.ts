export type EstadoActivo = "Disponible" | "Asignado" | "En reparacion" | "Dado de baja" | "Perdido" | "Revision";

export type ActivoFijo = {
  idActivoFijo: number;
  idDimension: number;
  idUsuario: number | null;
  ram: number | null;
  idMarca: number;
  idModelo: number;
  idProcesador: number | null;
  idDiscoDuro: number | null;
  serial: string;
  numeroFactura: string;
  rutProveedor: string;
  fechaCompra: string;
  detalles: string | null;
  esAF: boolean;
  idUsuarioRegistro: number | null;
  idEstadoActivo: number;
  activo: boolean;
  marca?: string;
  modelo?: string;
  procesador?: string;
  discoDuro?: string;
  estadoActivo?: EstadoActivo;
  dimension?: string;
  usuario?: string;
};

export type ActivoFijoPayload = {
  IdDimension: number;
  IdUsuario: number | null;
  RAM: number | null;
  IdMarca: number;
  IdModelo: number;
  IdProcesador: number | null;
  IdDiscoDuro: number | null;
  Serial: string;
  NumeroFactura: string;
  RutProveedor: string;
  FechaCompra: string;
  Detalles: string | null;
  IdUsuarioRegistro?: number | null;
  IdEstadoActivo: number;
  Activo: boolean;
};

export type ActivoFijoComputacional = {
  serieActivo: string;
  nombreEquipo: string;
  dominio: string;
  ramGB: number;
  procesador: string;
  almacenamiento: string;
  sistemaOperativo: string;
  ipEth0: string;
  serieCargador: string;
  serieBateria: string;
  bateria: string;
  meraki: boolean;
  antivirus: boolean;
  comentarios: string;
};

export type ChipBackupDetalle = {
  pin: string;
  puk: string;
  tienda: string;
};
