# Reglas de negocio

## Dimensiones SAP

Las dimensiones, centros de costo y canales operativos provienen de SAP. Los usuarios del sistema no pueden crear, editar ni eliminar dimensiones manualmente desde el frontend.

La API publica solo lectura para frontend:

- `GET /api/dimensiones`
- `GET /api/dimensiones/{id}`

La escritura queda reservada para sincronizacion SAP o jobs internos futuros.

## Maestros

No existe pantalla visual general llamada Maestros.

Los datos seleccionables se gestionan directamente desde el formulario de Nuevo Activo mediante selectores con opcion "+ Agregar otro":

- Marca
- Modelo
- Procesador
- Disco Duro
- Estado Activo

Dimension no permite "+ Agregar otro".

## Activo Fijo

Nuevo Activo inicia con seleccion visual por tipo:

- Notebook
- AIO
- Impresora
- Periferico
- Cargador / Fuente de poder
- Discos
- Chips
- Celulares
- Usuario
- Servidor
- Monitores
- TV

El tipo se transmite por query string, por ejemplo `/activo-fijo/nuevo?tipo=notebook`.

El tecnico responsable se obtiene desde la sesion del usuario logueado. Si no existe sesion, el formulario muestra error controlado.

El usuario asignado puede quedar vacio usando "Sin usuario asignado / Solo dimension".

## Movimientos

Movimientos no tiene menu independiente. Los ultimos movimientos se ven en Dashboard y el historial se consulta dentro del detalle del activo.

El backend registra movimiento cuando cambia usuario o dimension del activo.

## Configuracion

Configuracion muestra solo datos del usuario logueado, rol/perfil, dimension asociada y preferencias visuales. No permite administrar otros usuarios.

## Usuarios del sistema

Usuarios del sistema no equivale a empleados/personas asignables. Solo algunos empleados tienen login.

Solo Admin puede:

- Crear usuarios con acceso.
- Asignar contrasena inicial.
- Asignar rol.
- Asignar dimension.
- Activar o desactivar acceso.
- Resetear contrasena cuando la funcionalidad este implementada.
