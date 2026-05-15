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
  idEstadoActivo: number;
  marca?: string;
  modelo?: string;
  procesador?: string;
  discoDuro?: string;
  estadoActivo?: EstadoActivo;
  dimension?: string;
  usuario?: string;
};

export type ActivoFijoPayload = {
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
  idEstadoActivo: number;
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
