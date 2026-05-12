import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

const include = {
  Dimension: true,
  Usuario: true,
  Marca: true,
  Modelo: true,
  Procesador: true,
  DiscoDuro: true,
  EstadoActivo: true,
};

export const activoFijoRepository = {
  findAll: () => prisma.activoFijo.findMany({ include }),
  findById: (id: number) => prisma.activoFijo.findUnique({ where: { IdActivoFijo: id }, include }),
  findBySerial: (serial: string) => prisma.activoFijo.findUnique({ where: { Serial: serial }, include }),
  findByDimension: (IdDimension: number) => prisma.activoFijo.findMany({ where: { IdDimension }, include }),
  findByUsuario: (IdUsuario: number) => prisma.activoFijo.findMany({ where: { IdUsuario }, include }),
  findByEstado: (IdEstadoActivo: number) => prisma.activoFijo.findMany({ where: { IdEstadoActivo }, include }),
  create: (data: Prisma.ActivoFijoUncheckedCreateInput) =>
    prisma.activoFijo.create({ data, include }),
  delete: (id: number) => prisma.activoFijo.delete({ where: { IdActivoFijo: id } }),
};
