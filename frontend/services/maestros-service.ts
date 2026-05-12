import { canales, categorias, centrosCosto, marcas, tiendas } from "@/mocks/maestros";
import type { MasterOption } from "@/types/maestros";
import { delay } from "./delay";

const store = {
  categorias: [...categorias],
  centrosCosto: [...centrosCosto],
  canales: [...canales],
  tiendas: [...tiendas],
  marcas: [...marcas],
};

export type MaestroKey = keyof typeof store;

export const maestrosService = {
  async list(key: MaestroKey) {
    return delay([...store[key]]);
  },
  async add(key: MaestroKey, nombre: string) {
    const option: MasterOption = {
      id: `${key}-${Date.now()}`,
      codigo: nombre.toUpperCase().replace(/\s+/g, "-").slice(0, 12),
      nombre,
      activo: true,
    };
    store[key].unshift(option as never);
    return delay(option);
  },
};
