import { prisma } from "../../config/prisma";
import { createRepository } from "../../shared/utils/crud";

export const cuentaRepository = createRepository({
  delegate: prisma.cuenta,
  idField: "IdCuenta",
});
