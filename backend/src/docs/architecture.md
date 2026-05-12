# Arquitectura

El backend es un monolito modular Express.

## Capas

- Controller: recibe `Request`, llama al service y responde con formato consistente.
- Service: contiene reglas de negocio, como la generacion automatica de movimientos.
- Repository: encapsula acceso a Prisma.
- Prisma: define modelos, relaciones y migraciones.
- Middlewares: validacion, JWT preparado, errores globales y rutas no encontradas.
- Zod: valida `body`, `params` y `query` antes del controller.

## Errores

`error.middleware.ts` normaliza errores de Zod, errores HTTP propios y errores conocidos de Prisma.
