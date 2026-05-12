import type { MasterOption, Tienda } from "@/types/maestros";

export const categorias: MasterOption[] = [
  { id: "notebook", codigo: "NOTE", nombre: "Notebook", activo: true },
  { id: "aio", codigo: "AIO", nombre: "AIO", activo: true },
  { id: "macbook", codigo: "MAC", nombre: "MacBook", activo: true },
  { id: "imac", codigo: "IMAC", nombre: "iMac", activo: true },
  { id: "chip-bkp", codigo: "CHIP", nombre: "Chip BKP", activo: true },
  { id: "monitor", codigo: "MON", nombre: "Monitor", activo: true },
];

export const centrosCosto: MasterOption[] = [
  { id: "CC-TI", codigo: "CC-TI", nombre: "Tecnologia", activo: true },
  { id: "CC-VTA", codigo: "CC-VTA", nombre: "Ventas Retail", activo: true },
  { id: "CC-OPS", codigo: "CC-OPS", nombre: "Operaciones", activo: true },
];

export const canales: MasterOption[] = [
  { id: "RET", codigo: "RET", nombre: "Retail", activo: true },
  { id: "ECOM", codigo: "ECOM", nombre: "Ecommerce", activo: true },
  { id: "CORP", codigo: "CORP", nombre: "Corporativo", activo: true },
];

export const tiendas: Tienda[] = [
  { id: "T001", codigo: "T001", nombre: "Mall Plaza Vespucio", canal: "Retail", ciudad: "Santiago", activo: true },
  { id: "T002", codigo: "T002", nombre: "Costanera Center", canal: "Retail", ciudad: "Santiago", activo: true },
  { id: "T003", codigo: "T003", nombre: "Concepcion Centro", canal: "Retail", ciudad: "Concepcion", activo: true },
];

export const marcas: MasterOption[] = [
  { id: "lenovo", codigo: "LEN", nombre: "Lenovo", activo: true },
  { id: "apple", codigo: "APL", nombre: "Apple", activo: true },
  { id: "hp", codigo: "HP", nombre: "HP", activo: true },
  { id: "dell", codigo: "DEL", nombre: "Dell", activo: true },
];
