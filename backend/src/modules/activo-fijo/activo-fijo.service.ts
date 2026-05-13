import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../shared/utils/http-error";
import { messages } from "../../shared/constants/messages";
import { activoFijoRepository } from "./activo-fijo.repository";

const include = {
  Dimension: true,
  Usuario: true,
  Marca: true,
  Modelo: true,
  Procesador: true,
  DiscoDuro: true,
  EstadoActivo: true,
};

export const activoFijoService = {
  findAll: () => activoFijoRepository.findAll(),

  async findById(id: number) {
    const activo = await activoFijoRepository.findById(id);
    if (!activo) throw new HttpError(404, messages.notFound);
    return activo;
  },

  async findBySerial(serial: string) {
    const activo = await activoFijoRepository.findBySerial(serial);
    if (!activo) throw new HttpError(404, messages.notFound);
    return activo;
  },

  findByDimension: (id: number) => activoFijoRepository.findByDimension(id),
  findByUsuario: (id: number) => activoFijoRepository.findByUsuario(id),
  findByEstado: (id: number) => activoFijoRepository.findByEstado(id),

  // Crea activos fijos desde el modulo aprobado; EsAF se deriva en servidor.
  create: (data: Prisma.ActivoFijoUncheckedCreateInput) => activoFijoRepository.create({ ...data, EsAF: true }),

  // Actualiza el activo y registra un movimiento cuando cambia dimension o usuario.
  async update(id: number, data: Prisma.ActivoFijoUncheckedUpdateInput) {
    const previous = await this.findById(id);
    const nextDimension = typeof data.IdDimension === "number" ? data.IdDimension : previous.IdDimension;
    const nextUsuario = typeof data.IdUsuario === "number" || data.IdUsuario === null ? data.IdUsuario : previous.IdUsuario;
    const changedAssignment = previous.IdDimension !== nextDimension || previous.IdUsuario !== nextUsuario;

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.activoFijo.update({
        where: { IdActivoFijo: id },
        data,
        include,
      });

      if (changedAssignment) {
        await tx.movimientosActivoFijo.create({
          data: {
            IdActivoFijo: id,
            IdDimensionAnterior: previous.IdDimension,
            IdDimensionNueva: nextDimension,
            IdUsuarioAnterior: previous.IdUsuario,
            IdUsuarioNuevo: nextUsuario,
            FechaMovimiento: new Date(),
            Observacion: "Movimiento generado automaticamente por actualizacion de asignacion",
          },
        });
      }

      return updated;
    });
  },

  async delete(id: number) {
    await this.findById(id);
    await activoFijoRepository.delete(id);
    return null;
  },
};
