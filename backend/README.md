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

`ActivoFijo` es la tabla central. Se relaciona con dimensiones, usuarios, marcas, modelos, procesadores, discos y estados. `IdUsuario` es nullable porque un activo puede pertenecer solo a una dimension. `MovimientosActivoFijo` conserva el historial cuando cambia `IdDimension` o `IdUsuario`. `Checklist` queda sin relacion porque solo guarda plantillas descargables.

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
"DefaultConnection": "Server=localhost,1433;Database=AudiomusicaAssetManagement;User Id=sa;Password=Your_password123;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

## Docker

No tocar en esta etapa. No se modifico `Dockerfile`, `docker-compose.yml` ni archivos bajo `docker/`.

## Endpoints

- `GET /health`
- CRUD dimensiones: `/api/dimensiones`
- CRUD usuarios: `/api/usuarios`
- CRUD cuenta: `/api/cuenta`
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
curl https://localhost:5001/api/activo-fijo
```

Crear activo:

```json
{
  "IdDimension": 1,
  "IdUsuario": null,
  "IdMarca": 1,
  "IdModelo": 1,
  "Serial": "SERIAL-001",
  "EsAF": true,
  "IdEstadoActivo": 1
}
```

Actualizar `IdDimension` o `IdUsuario` crea un registro automatico en `MovimientosActivoFijo`.

## Documentacion adicional

- `src/docs/database.md`
- `src/docs/api.md`
- `src/docs/docker.md`
- `src/docs/architecture.md`
- `src/modules/*/*.md`

## Troubleshooting

- Si SQL Server no acepta conexiones, espere a que el healthcheck del contenedor termine y revise que la password cumpla complejidad.
- Si `prisma migrate` falla desde el host, use `localhost` en `DATABASE_URL`; dentro de Docker use `database`.
- Si aparece `P2002`, el registro viola una restriccion unique, por ejemplo `Serial`.
- Si aparece `P2003`, alguna FK enviada no existe.
