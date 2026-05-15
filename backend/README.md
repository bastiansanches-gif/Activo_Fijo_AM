# Audiomusica Asset Management Backend

Backend .NET 8 Web API para gestionar activos fijos, usuarios, dimensiones, checklist, movimientos y herramientas.

La estructura Node/Prisma previa queda en el repositorio, pero la etapa actual usa la solucion .NET:

```text
backend/
  Audiomusica.AssetManagement.sln
  NuGet.config
  src/
    Audiomusica.Domain/
    Audiomusica.Application/
    Audiomusica.Infrastructure/
    Audiomusica.WebApi/
```

## Modelo de datos

`ActivoFijo` es la tabla central. Se relaciona con dimensiones, usuarios, marcas, modelos, procesadores, discos y estados. `IdUsuario`, `RAM`, `IdProcesador` e `IdDiscoDuro` son nullable. `Serial` es unico. `MovimientosActivoFijo` conserva el historial cuando cambia `IdDimension` o `IdUsuario`. `Checklist` queda sin relacion porque solo guarda plantillas descargables.

Dimensiones no se cargan por seed; seran sincronizadas desde SAP HANA.

## Instalacion local

```powershell
cd backend
dotnet restore Audiomusica.AssetManagement.sln
dotnet build Audiomusica.AssetManagement.sln
dotnet run --project src/Audiomusica.WebApi/Audiomusica.WebApi.csproj
```

La API queda disponible en el puerto informado por Kestrel. Swagger queda en `/swagger`.

## Variables de entorno

Revise `src/Audiomusica.WebApi/appsettings.Development.json`.

```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=AudiomusicaAssetManagementDb;User Id=audiomusica_app;Password=Amsa.2026#;TrustServerCertificate=True;Encrypt=False;"
```

En produccion/Linux se puede sobrescribir con la variable `ConnectionStrings__DefaultConnection`.

## Docker

El backend tiene Dockerfile propio en `backend/Dockerfile`. La forma recomendada es levantarlo desde el `docker-compose.yml` de la raiz junto con SQL Server y el frontend:

```powershell
cd ..
Copy-Item .env.example .env
docker compose up -d --build
```

La API queda publicada en `http://localhost:5077` y Swagger en `http://localhost:5077/swagger`.

Dentro de Docker se configuran estas variables:

```text
ASPNETCORE_URLS=http://+:8080
Database__ApplyMigrations=true
ConnectionStrings__DefaultConnection=Server=sqlserver,1433;Database=AudiomusicaAssetManagementDb;...
Cors__AllowedOrigins__0=http://localhost:3000
```

`Database__ApplyMigrations=true` es opt-in y solo se usa en Docker para crear/actualizar la base al iniciar el contenedor.

Para construir solo la API:

```powershell
docker build -t audiomusica-backend .
```

## Flujo local sin Docker

```powershell
dotnet ef database update --project src/Audiomusica.Infrastructure --startup-project src/Audiomusica.WebApi
dotnet run --project src/Audiomusica.WebApi/Audiomusica.WebApi.csproj
```

Swagger queda disponible en:

```text
http://localhost:<PUERTO_BACKEND>/swagger
```

## Endpoints

- `GET /health`
- `GET /api/health/database`
- CRUD dimensiones: `/api/dimensiones`
- CRUD usuarios: `/api/usuarios`
- CRUD cuentas: `/api/cuentas`
- CRUD usuario-cuentas: `/api/usuario-cuentas`
- CRUD marcas: `/api/marcas`
- CRUD modelos: `/api/modelos`
- CRUD procesadores: `/api/procesadores`
- CRUD discos duros: `/api/discos-duros`
- CRUD estados activo: `/api/estados-activo`
- CRUD activo fijo: `/api/activo-fijo`
- Filtros activo fijo: `/api/activo-fijo/serial/:serial`, `/dimension/:idDimension`, `/usuario/:idUsuario`, `/estado/:idEstadoActivo`
- Movimientos: `/api/movimientos-activo-fijo` y `/api/movimientos-activo-fijo/activo/:idActivoFijo`
- Checklist: `/api/checklist` y `/api/checklist/{id}/download`
- Herramientas: `/api/herramientas`, `/api/herramientas/dimension/{idDimension}`, `/api/herramientas/estado/{estado}`
- Dashboard: `/api/dashboard/resumen`

## Probar la API

Ejemplo:

```powershell
curl http://localhost:5077/api/health/database
curl http://localhost:5077/api/activo-fijo
```

Crear activo:

```json
{
  "IdDimension": 1,
  "IdUsuario": null,
  "IdMarca": 1,
  "IdModelo": 1,
  "Serial": "SERIAL-001",
  "IdEstadoActivo": 1
}
```

`EsAF` no se selecciona desde la UI; lo define el backend. Actualizar `IdDimension` o `IdUsuario` crea un registro automatico en `MovimientosActivoFijo`.

## Documentacion adicional

- `../docs/database-connection.md`
- `../docs/database-docker.md`
- `src/docs/database.md`
- `src/docs/api.md`
- `src/docs/docker.md`
- `src/docs/architecture.md`
- `src/modules/*/*.md`

## Troubleshooting

- Si SQL Server no acepta conexiones desde Windows, probar `Test-NetConnection localhost -Port 1433`.
- Si SQL Server no acepta conexiones desde Linux, probar `nc -zv 128.10.68.30 1433`.
- Si `dotnet ef database update` falla por permisos, confirmar que `audiomusica_app` tenga temporalmente `db_datareader`, `db_datawriter` y `db_ddladmin`.
