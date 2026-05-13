import { apiClient } from "./apiClient";

export type MarcaApi = {
  idMarca?: number;
  IdMarca?: number;
  nombreMarca?: string;
  NombreMarca?: string;
};

export type ModeloApi = {
  idModelo?: number;
  IdModelo?: number;
  idMarca?: number;
  IdMarca?: number;
  nombreModelo?: string;
  NombreModelo?: string;
};

export type ProcesadorApi = {
  idProcesador?: number;
  IdProcesador?: number;
  nombreProcesador?: string;
  NombreProcesador?: string;
};

export type DiscoDuroApi = {
  idDiscoDuro?: number;
  IdDiscoDuro?: number;
  tipoDisco?: string;
  TipoDisco?: string;
  capacidadGB?: number;
  CapacidadGB?: number;
  descripcion?: string;
  Descripcion?: string;
};

export type EstadoActivoApi = {
  idEstadoActivo?: number;
  IdEstadoActivo?: number;
  nombreEstado?: string;
  NombreEstado?: string;
};

export const getId = (item: object, camel: string, pascal: string) => {
  const record = item as Record<string, unknown>;
  return Number(record[camel] ?? record[pascal] ?? 0);
};

export const getText = (item: object, camel: string, pascal: string) => {
  const record = item as Record<string, unknown>;
  return String(record[camel] ?? record[pascal] ?? "");
};

export const catalogosService = {
  marcas: {
    list: () => apiClient<MarcaApi[]>("/marcas"),
    create: (nombre: string) => apiClient<MarcaApi>("/marcas", { method: "POST", body: JSON.stringify({ NombreMarca: nombre }) }),
  },
  modelos: {
    list: () => apiClient<ModeloApi[]>("/modelos"),
    create: (nombre: string, idMarca = 1) =>
      apiClient<ModeloApi>("/modelos", { method: "POST", body: JSON.stringify({ IdMarca: idMarca, NombreModelo: nombre }) }),
  },
  procesadores: {
    list: () => apiClient<ProcesadorApi[]>("/procesadores"),
    create: (nombre: string) =>
      apiClient<ProcesadorApi>("/procesadores", { method: "POST", body: JSON.stringify({ NombreProcesador: nombre }) }),
  },
  discosDuros: {
    list: () => apiClient<DiscoDuroApi[]>("/discos-duros"),
    create: (descripcion: string) =>
      apiClient<DiscoDuroApi>("/discos-duros", {
        method: "POST",
        body: JSON.stringify({ TipoDisco: "SSD", CapacidadGB: 1, Descripcion: descripcion }),
      }),
    createDisco: (tipoDisco: string, capacidadGB: number) =>
      apiClient<DiscoDuroApi>("/discos-duros", {
        method: "POST",
        body: JSON.stringify({ TipoDisco: tipoDisco, CapacidadGB: capacidadGB, Descripcion: `${tipoDisco} ${capacidadGB >= 1024 ? `${capacidadGB / 1024}TB` : `${capacidadGB}GB`}` }),
      }),
  },
  estadosActivo: {
    list: () => apiClient<EstadoActivoApi[]>("/estados-activo"),
    create: (nombre: string) =>
      apiClient<EstadoActivoApi>("/estados-activo", { method: "POST", body: JSON.stringify({ NombreEstado: nombre }) }),
  },
};
