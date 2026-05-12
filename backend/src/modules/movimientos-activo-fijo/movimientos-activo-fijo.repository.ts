import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

const include = {
  ActivoFijo: true,
  DimensionAnterior: true,
  DimensionNueva: true,
  UsuarioAnterior: true,
  UsuarioNuevo: true,
};

export const movimientosActivoFijoRepository = {
  findAll: () => prisma.movimientosActivoFijo.findMany({ include, orderBy: { FechaMovimiento: "desc" } }),
  findById: (id: number) => prisma.movimientosActivoFijo.findUnique({ where: { IdMovimiento: id }, include }),
  findByActivo: (IdActivoFijo: number) =>
    prisma.movimientosActivoFijo.findMany({
      where: { IdActivoFijo },
      include,
      orderBy: { FechaMovimiento: "desc" },
    }),
  create: (data: Prisma.MovimientosActivoFijoUncheckedCreateInput) =>
    prisma.movimientosActivoFijo.create({ data, include }),
};
