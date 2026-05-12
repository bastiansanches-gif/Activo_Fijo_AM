# Base de datos

El modelo usa SQL Server mediante Prisma ORM. Los nombres de tablas y campos se mantienen en espanol segun el MER.

## Tablas

- `Dimensiones`: unidad organizacional relacionada con SAP. Tiene `IdDimension`, `NumeroDimension`, `NombreDimension` y `Activo`.
- `Usuarios`: personas que pueden tener activos asignados. Se relaciona con `Cargos`, `Dimensiones` y `Cuenta`.
- `Cuenta`: catalogo de cuentas asignables a usuarios.
- `Cargos`: catalogo de cargos. El PK se mantiene como `IdRol` porque asi viene del MER; representa el cargo del usuario.
- `Marcas`: catalogo de marcas.
- `Modelos`: modelos asociados a marcas.
- `Procesadores`: catalogo opcional para activos computacionales.
- `DiscosDuros`: catalogo opcional de almacenamiento.
- `EstadosActivo`: estado logico del activo.
- `ActivoFijo`: tabla central donde se registran activos, asignacion, compra y estado.
- `MovimientosActivoFijo`: historial de cambios de dimension o usuario.
- `Checklist`: plantillas descargables sin relacion con activos.

## Relaciones

`ActivoFijo` concentra las FK hacia dimension, usuario, marca, modelo, procesador, disco y estado. `IdUsuario` es nullable porque un activo puede estar asignado solo a una dimension, por ejemplo impresoras, equipos de red o stock de bodega.

`MovimientosActivoFijo` referencia dos veces `Dimensiones` y dos veces `Usuarios` para guardar origen y destino. No reemplaza el estado actual de `ActivoFijo`; solo conserva historial.

`Checklist` no se conecta a `ActivoFijo` porque el alcance definido es almacenar referencias a archivos descargables, no resultados de checklist por activo.
