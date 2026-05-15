# Audiomusica Asset Management

Sistema para gestion interna de activos fijos, usuarios con acceso, dimensiones SAP, checklist, movimientos y herramientas de informatica.

## Backend .NET 8

```powershell
cd backend
dotnet restore Audiomusica.AssetManagement.sln
dotnet build Audiomusica.AssetManagement.sln
dotnet run --project src/Audiomusica.WebApi/Audiomusica.WebApi.csproj
```

Swagger queda disponible en `https://localhost:5001/swagger` o el puerto que indique Kestrel.

Connection string: `backend/src/Audiomusica.WebApi/appsettings.Development.json`.

Para pruebas de endpoints, el backend usa SQL Server Express 2022 en Windows Server 2019. Ver guia: `docs/database-connection.md`.

Migraciones:

```powershell
cd backend
dotnet ef migrations add InitialCreate --project src/Audiomusica.Infrastructure --startup-project src/Audiomusica.WebApi
dotnet ef database update --project src/Audiomusica.Infrastructure --startup-project src/Audiomusica.WebApi
```

## Frontend

```powershell
cd frontend
npm install
$env:NEXT_PUBLIC_API_BASE_URL="https://localhost:5001/api"
npm run dev
```

## Modulos

Endpoints CRUD: roles, dimensiones, cuentas, usuario-cuentas, usuarios, marcas, modelos, procesadores, discos-duros, estados-activo, activo-fijo, movimientos-activo-fijo, checklist y herramientas.

Dimensiones no se cargan por seed; seran sincronizadas desde SAP HANA.

Especiales: filtros de activo fijo por serial/dimension/usuario/estado, movimientos por activo, checklist download, herramientas por dimension/estado y dashboard resumen.

## Reglas funcionales vigentes

- No existe pantalla visual general llamada Maestros.
- Marca, Modelo, Procesador, Disco Duro y Estado Activo se administran desde los selectores del formulario de Nuevo Activo mediante "+ Agregar otro".
- Dimension viene desde SAP HANA en una fase posterior. Por ahora el backend expone CRUD, pero el seed la deja vacia.
- Movimientos no tiene menu propio; se consultan en Dashboard y en el historial del detalle del activo.
- Configuracion muestra solo datos y preferencias del usuario logueado.
- Solo Admin gestiona usuarios con acceso al sistema.

## Docker

El proyecto queda dockerizado con tres servicios separados:

- `sqlserver`: SQL Server 2022 para desarrollo aislado.
- `backend`: API .NET 8 desde `backend/Dockerfile`.
- `frontend`: Next.js desde `frontend/Dockerfile`.

El orquestador vive en la raiz: `docker-compose.yml`.

### Levantar todo

```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5077`
- Swagger: `http://localhost:5077/swagger`
- Health database: `http://localhost:5077/api/health/database`

La API corre con `Database__ApplyMigrations=true` dentro de Docker, por lo que aplica las migraciones pendientes al arrancar y crea `AudiomusicaAssetManagementDb` en el contenedor SQL Server.

### Probar el stack

```powershell
docker compose ps
curl http://localhost:5077/api/health/database
curl http://localhost:5077/api/dashboard/resumen
curl http://localhost:3000
```

### Logs y parada

```powershell
docker compose logs -f backend
docker compose logs -f frontend
docker compose down
```

Para borrar tambien la base de datos del contenedor:

```powershell
docker compose down -v
```

### Variables

`.env.example` define:

```text
MSSQL_SA_PASSWORD=Amsa2026Docker!
SQLSERVER_PORT=11433
BACKEND_PORT=5077
FRONTEND_PORT=3000
```

En ambientes no Docker se mantiene la configuracion de `appsettings.Development.json` o la variable `ConnectionStrings__DefaultConnection`.
