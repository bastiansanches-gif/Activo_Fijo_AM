import { PrismaClient } from "@prisma/client";

// Cliente Prisma unico para compartir el pool de conexiones en toda la API.
export const prisma = new PrismaClient();
