import { HttpError } from "../../shared/utils/http-error";
import { messages } from "../../shared/constants/messages";
import { movimientosActivoFijoRepository } from "./movimientos-activo-fijo.repository";

export const movimientosActivoFijoService = {
  findAll: () => movimientosActivoFijoRepository.findAll(),
  async findById(id: number) {
    const movimiento = await movimientosActivoFijoRepository.findById(id);
    if (!movimiento) throw new HttpError(404, messages.notFound);
    return movimiento;
  },
  findByActivo: (id: number) => movimientosActivoFijoRepository.findByActivo(id),
  create: (data: Parameters<typeof movimientosActivoFijoRepository.create>[0]) =>
    movimientosActivoFijoRepository.create(data),
};
