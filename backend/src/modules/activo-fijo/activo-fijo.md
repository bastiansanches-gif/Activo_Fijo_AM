# Activo Fijo

Tabla central del sistema. Registra activos con dimension obligatoria, usuario opcional, marca, modelo, estado y datos de compra.

Cuando cambia `IdDimension` o `IdUsuario`, el service crea automaticamente un registro en `MovimientosActivoFijo`.

Endpoints: CRUD en `/api/activo-fijo` y filtros por serial, dimension, usuario y estado.
