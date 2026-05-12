export type EstadoActivo = "Disponible" | "Asignado" | "En tienda" | "Baja" | "Revision";

export type ActivoFijo = {
  serieActivo: string;
  sku: string;
  codSAP: string;
  nomActivo: string;
  categoriaActivo: string;
  marca: string;
  modelo: string;
  estadoActivo: EstadoActivo;
  codEmpleado: string;
  codCC: string;
  codCanal: string;
  idTienda: string;
  codUsuarioIngreso: string;
  codUsuarioModifica?: string;
  fechaCompra: string;
  numeroFactura: string;
  proveedorNombre: string;
  precioCompra: number;
  ubicacionTexto: string;
  detalles: string;
  esSerializado: boolean;
  activo: boolean;
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
