import type { ActivoFijo, ActivoFijoPayload, EstadoActivo } from "@/types/activo-fijo";
import { apiClient } from "./apiClient";

type ApiActivoFijo = {
  idActivoFijo?: number;
  IdActivoFijo?: number;
  idDimension?: number;
  IdDimension?: number;
  idUsuario?: number | null;
  IdUsuario?: number | null;
  ram?: number | null;
  RAM?: number | null;
  idMarca?: number;
  IdMarca?: number;
  idModelo?: number;
  IdModelo?: number;
  idProcesador?: number | null;
  IdProcesador?: number | null;
  idDiscoDuro?: number | null;
  IdDiscoDuro?: number | null;
  serial?: string;
  Serial?: string;
  numeroFactura?: string | null;
  NumeroFactura?: string | null;
  rutProveedor?: string | null;
  RutProveedor?: string | null;
  fechaCompra?: string | null;
  FechaCompra?: string | null;
  detalles?: string | null;
  Detalles?: string | null;
  esAF?: boolean;
  EsAF?: boolean;
  idEstadoActivo?: number;
  IdEstadoActivo?: number;
  marca?: { nombreMarca?: string; NombreMarca?: string } | null;
  Marca?: { nombreMarca?: string; NombreMarca?: string } | null;
  modelo?: { nombreModelo?: string; NombreModelo?: string } | null;
  Modelo?: { nombreModelo?: string; NombreModelo?: string } | null;
  procesador?: { nombreProcesador?: string; NombreProcesador?: string } | null;
  Procesador?: { nombreProcesador?: string; NombreProcesador?: string } | null;
  discoDuro?: { descripcion?: string; Descripcion?: string } | null;
  DiscoDuro?: { descripcion?: string; Descripcion?: string } | null;
  estadoActivo?: { nombreEstado?: string; NombreEstado?: string } | null;
  EstadoActivo?: { nombreEstado?: string; NombreEstado?: string } | null;
  dimension?: { numeroDimension?: string; NumeroDimension?: string; nombreDimension?: string; NombreDimension?: string } | null;
  Dimension?: { numeroDimension?: string; NumeroDimension?: string; nombreDimension?: string; NombreDimension?: string } | null;
  usuario?: { nombreUsuario?: string; NombreUsuario?: string; apellidoPaterno?: string; ApellidoPaterno?: string } | null;
  Usuario?: { nombreUsuario?: string; NombreUsuario?: string; apellidoPaterno?: string; ApellidoPaterno?: string } | null;
};

function mapActivo(api: ApiActivoFijo): ActivoFijo {
  const idEstadoActivo = api.idEstadoActivo ?? api.IdEstadoActivo ?? 0;
  const estadoNombre = api.estadoActivo?.nombreEstado ?? api.EstadoActivo?.NombreEstado ?? api.EstadoActivo?.nombreEstado;
  const dimensionNumero = api.dimension?.numeroDimension ?? api.Dimension?.NumeroDimension ?? api.Dimension?.numeroDimension;
  const dimensionNombre = api.dimension?.nombreDimension ?? api.Dimension?.NombreDimension ?? api.Dimension?.nombreDimension;
  const usuarioNombre = api.usuario?.nombreUsuario ?? api.Usuario?.NombreUsuario ?? api.Usuario?.nombreUsuario;
  const usuarioApellido = api.usuario?.apellidoPaterno ?? api.Usuario?.ApellidoPaterno ?? api.Usuario?.apellidoPaterno;

  return {
    idActivoFijo: api.idActivoFijo ?? api.IdActivoFijo ?? 0,
    idDimension: api.idDimension ?? api.IdDimension ?? 0,
    idUsuario: api.idUsuario ?? api.IdUsuario ?? null,
    ram: api.ram ?? api.RAM ?? null,
    idMarca: api.idMarca ?? api.IdMarca ?? 0,
    idModelo: api.idModelo ?? api.IdModelo ?? 0,
    idProcesador: api.idProcesador ?? api.IdProcesador ?? null,
    idDiscoDuro: api.idDiscoDuro ?? api.IdDiscoDuro ?? null,
    serial: api.serial ?? api.Serial ?? "",
    numeroFactura: api.numeroFactura ?? api.NumeroFactura ?? "",
    rutProveedor: api.rutProveedor ?? api.RutProveedor ?? "",
    fechaCompra: api.fechaCompra ?? api.FechaCompra ?? "",
    detalles: api.detalles ?? api.Detalles ?? null,
    esAF: api.esAF ?? api.EsAF ?? true,
    idEstadoActivo,
    marca: api.marca?.nombreMarca ?? api.Marca?.NombreMarca ?? api.Marca?.nombreMarca,
    modelo: api.modelo?.nombreModelo ?? api.Modelo?.NombreModelo ?? api.Modelo?.nombreModelo,
    procesador: api.procesador?.nombreProcesador ?? api.Procesador?.NombreProcesador ?? api.Procesador?.nombreProcesador,
    discoDuro: api.discoDuro?.descripcion ?? api.DiscoDuro?.Descripcion ?? api.DiscoDuro?.descripcion,
    estadoActivo: (estadoNombre ?? estadoFromId(idEstadoActivo)) as EstadoActivo,
    dimension: [dimensionNumero, dimensionNombre].filter(Boolean).join(" - ") || undefined,
    usuario: [usuarioNombre, usuarioApellido].filter(Boolean).join(" ") || undefined,
  };
}

function estadoFromId(id: number): EstadoActivo {
  if (id === 1) return "Disponible";
  if (id === 2) return "Asignado";
  if (id === 3) return "En reparacion";
  if (id === 4) return "Dado de baja";
  if (id === 5) return "Perdido";
  return "Revision";
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
  async create(payload: ActivoFijoPayload) {
    return apiClient<ApiActivoFijo>("/activo-fijo", { method: "POST", body: JSON.stringify(payload) });
  },
  async update(id: number, payload: ActivoFijoPayload) {
    return apiClient<ApiActivoFijo>(`/activo-fijo/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },
  async remove(id: number) {
    return apiClient<void>(`/activo-fijo/${id}`, { method: "DELETE" });
  },
};
