# Database

Base esperada: SQL Server.

Connection string local:

```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=AudiomusicaAssetManagementDb;User Id=audiomusica_app;Password=Amsa.2026#;TrustServerCertificate=True;Encrypt=False;"
```

Para la arquitectura actual, usar SQL Server Express 2022 en Windows Server 2019 con la guia `docs/database-connection.md`. Docker queda solo como alternativa opcional de desarrollo aislado y no es el flujo productivo actual.

No usar `sa` en la aplicacion. Usar `audiomusica_app`.

## Tablas oficiales

- `Roles`: controla permisos del sistema. Campos: `IdRol`, `NombreRol`.
- `Dimensiones`: unidad operativa donde se asignan activos o usuarios. Campos: `IdDimension`, `NumeroDimension`, `NombreDimension`, `Activo`.
- `Cuentas`: catalogo de cuentas/licencias posibles. Campos: `IdCuenta`, `NombreCuenta`.
- `Usuarios`: personas registradas en el sistema. Campos: `IdUsuario`, `Rut`, `NombreUsuario`, `ApellidoPaterno`, `ApellidoMaterno`, `CorreoCorporativo`, `FechaIngreso`, `FinContrato`, `IdRol`, `IdDimension`, `Activo`.
- `UsuarioCuentas`: relacion muchos a muchos entre usuarios y cuentas. Campos: `IdUsuarioCuenta`, `IdUsuario`, `IdCuenta`.
- `Marcas`: catalogo de marcas. Campos: `IdMarca`, `NombreMarca`.
- `Modelos`: modelos asociados a marca. Campos: `IdModelo`, `IdMarca`, `NombreModelo`.
- `Procesadores`: catalogo de procesadores. Campos: `IdProcesador`, `NombreProcesador`.
- `DiscosDuros`: catalogo de discos. Campos: `IdDiscoDuro`, `TipoDisco`, `CapacidadGB`, `Descripcion`.
- `EstadosActivo`: catalogo de estados del activo. Campos: `IdEstadoActivo`, `NombreEstado`.
- `ActivoFijo`: tabla principal del sistema. Campos: `IdActivoFijo`, `IdDimension`, `IdUsuario`, `RAM`, `IdMarca`, `IdModelo`, `IdProcesador`, `IdDiscoDuro`, `Serial`, `NumeroFactura`, `RutProveedor`, `FechaCompra`, `Detalles`, `EsAF`, `IdEstadoActivo`.
- `MovimientosActivoFijo`: historial de cambios de usuario/dimension. Campos: `IdMovimiento`, `IdActivoFijo`, `IdDimensionAnterior`, `IdDimensionNueva`, `IdUsuarioAnterior`, `IdUsuarioNuevo`, `FechaMovimiento`, `Observacion`.
- `Checklist`: plantillas descargables independientes de `ActivoFijo`. Campos: `IdChecklist`, `NombreChecklist`, `TipoChecklist`, `NombreArchivo`, `RutaArchivo`, `ExtensionArchivo`, `FechaCreacion`.
- `Herramientas`: herramientas que no son activo fijo contable. Campos: `IdHerramienta`, `NombreHerramienta`, `TipoHerramienta`, `Marca`, `Modelo`, `Serial`, `Cantidad`, `IdDimension`, `Estado`, `Detalles`, `FechaRegistro`, `Activo`.

## Reglas

- `ActivoFijo.IdUsuario` puede ser `NULL`.
- `ActivoFijo.RAM` puede ser `NULL`.
- `ActivoFijo.IdProcesador` puede ser `NULL`.
- `ActivoFijo.IdDiscoDuro` puede ser `NULL`.
- `ActivoFijo.Serial` es unico.
- `ActivoFijo.EsAF` no lo selecciona el usuario; lo define el backend segun tipo de activo. En la version actual se fuerza como `true` al crear o actualizar activos fijos.
- Cuando cambia `ActivoFijo.IdUsuario` o `ActivoFijo.IdDimension`, el backend crea automaticamente un registro en `MovimientosActivoFijo`.
- `Checklist` no se conecta con `ActivoFijo`.
- `Herramientas` es independiente de `ActivoFijo` porque no representa necesariamente activo contable.
- No se crean tablas `SAP_*` todavia.

## Seed inicial

`Dimensiones` no se cargan por seed; seran sincronizadas desde SAP HANA.

La tabla `Cuentas` se carga exactamente con:

- Office
- Microsoft
- Adobe
- SAP
- TPV
- Google (Correo)
- Apple ID
- AutoCAD
- Active Directory
- VPN
- Retail Pro
- Fecele

Tambien se cargan catalogos base para roles, marcas, modelos, procesadores, discos, estados, herramientas sin dimension y checklist.
