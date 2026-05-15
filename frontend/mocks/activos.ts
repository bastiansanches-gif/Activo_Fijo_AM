import type { ActivoFijo } from "@/types/activo-fijo";

export const mockActivos: ActivoFijo[] = [
  {
    idActivoFijo: 1,
    idDimension: 1,
    idUsuario: 2,
    ram: 16,
    idMarca: 2,
    idModelo: 2,
    idProcesador: 1,
    idDiscoDuro: 2,
    serial: "NB-LEN-001245",
    numeroFactura: "F-10233",
    rutProveedor: "76000000-0",
    fechaCompra: "2025-10-14",
    detalles: "Equipo asignado a sala de ventas.",
    esAF: true,
    idEstadoActivo: 2,
    marca: "Lenovo",
    modelo: "ThinkPad E14",
    estadoActivo: "Asignado",
    dimension: "DIM-001 - TI Soporte",
    usuario: "Camila Rojas",
  },
];
