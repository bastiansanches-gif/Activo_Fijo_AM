import type { ActivoFijo } from "@/types/activo-fijo";
import { apiClient } from "./apiClient";

type ApiActivoFijo = {
  idActivoFijo: number;
  idDimension: number;
  idUsuario?: number | null;
  ram?: number | null;
  idMarca: number;
  idModelo: number;
  serial: string;
  numeroFactura: string;
  rutProveedor: string;
  fechaCompra: string;
  detalles?: string | null;
  esAF: boolean;
  idEstadoActivo: number;
  activo: boolean;
};

type ActivoFijoCreateInput = Partial<ApiActivoFijo> | Partial<ActivoFijo>;

const marcaIds: Record<string, number> = { HP: 1, Lenovo: 2, Dell: 3, Apple: 4, Ubiquiti: 5, Brother: 6 };
const modeloIds: Record<string, number> = {
  "ProBook 440": 1,
  ThinkPad: 2,
  Latitude: 3,
  "MacBook Pro": 4,
  iMac: 5,
  "UniFi AP": 6,
};
const estadoIds: Record<string, number> = { Disponible: 1, Asignado: 2, Revision: 3, Baja: 4, Perdido: 5 };

function mapActivo(api: ApiActivoFijo): ActivoFijo {
  const estado = api.idEstadoActivo === 1 ? "Disponible" : api.idEstadoActivo === 2 ? "Asignado" : api.idEstadoActivo === 4 ? "Baja" : "Revision";
  return {
    serieActivo: api.serial,
    sku: String(api.idActivoFijo),
    codSAP: `AF-${api.idActivoFijo}`,
    nomActivo: api.ram ? `Equipo ${api.ram}GB RAM` : "Activo fijo",
    categoriaActivo: api.esAF ? "Activo fijo" : "Operacional",
    marca: `Marca ${api.idMarca}`,
    modelo: `Modelo ${api.idModelo}`,
    estadoActivo: estado,
    codEmpleado: api.idUsuario ? String(api.idUsuario) : "",
    codCC: String(api.idDimension),
    codCanal: "",
    idTienda: "",
    codUsuarioIngreso: "api",
    fechaCompra: api.fechaCompra,
    numeroFactura: api.numeroFactura,
    proveedorNombre: api.rutProveedor,
    precioCompra: 0,
    ubicacionTexto: `Dimension ${api.idDimension}`,
    detalles: api.detalles ?? "",
    esSerializado: true,
    activo: api.activo,
  };
}

// Acepta el formulario legado y lo transforma al contrato real expuesto por la Web API .NET.
function toApiPayload(payload: ActivoFijoCreateInput): Partial<ApiActivoFijo> {
  if ("serial" in payload || "idDimension" in payload) {
    return payload as Partial<ApiActivoFijo>;
  }

  const form = payload as Partial<ActivoFijo>;
  const idMarca = marcaIds[form.marca ?? ""] ?? 1;
  const idModelo = modeloIds[form.modelo ?? ""] ?? (idMarca === 1 ? 1 : 2);
  const idEstadoActivo = estadoIds[form.estadoActivo ?? "Disponible"] ?? 1;
  const parsedDimension = Number.parseInt((form.codCC ?? "1").replace(/\D/g, ""), 10);
  const parsedUsuario = Number.parseInt((form.codEmpleado ?? "").replace(/\D/g, ""), 10);

  return {
    idDimension: Number.isFinite(parsedDimension) && parsedDimension > 0 ? parsedDimension : 1,
    idUsuario: Number.isFinite(parsedUsuario) && parsedUsuario > 0 ? parsedUsuario : null,
    ram: undefined,
    idMarca,
    idModelo,
    serial: form.serieActivo ?? "",
    numeroFactura: form.numeroFactura ?? "",
    rutProveedor: form.proveedorNombre ?? "76000000-0",
    fechaCompra: form.fechaCompra ?? new Date().toISOString(),
    detalles: form.detalles ?? "",
    esAF: true,
    idEstadoActivo,
    activo: form.activo ?? true,
  };
}

export const activoFijoService = {
  async list() {
    const data = await apiClient<ApiActivoFijo[]>("/activo-fijo");
    return data.map(mapActivo);
  },
  async getBySerie(serie: string) {
    const data = await apiClient<ApiActivoFijo>(`/activo-fijo/serial/${encodeURIComponent(serie)}`);
    return mapActivo(data);
  },
  async create(payload: ActivoFijoCreateInput) {
    return apiClient<ApiActivoFijo>("/activo-fijo", { method: "POST", body: JSON.stringify(toApiPayload(payload)) });
  },
  async update(id: number, payload: ActivoFijoCreateInput) {
    return apiClient<ApiActivoFijo>(`/activo-fijo/${id}`, { method: "PUT", body: JSON.stringify(toApiPayload(payload)) });
  },
  async remove(id: number) {
    return apiClient<void>(`/activo-fijo/${id}`, { method: "DELETE" });
  },
};
