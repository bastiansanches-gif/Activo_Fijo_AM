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

Endpoints CRUD: roles, usuarios, cuenta, marcas, modelos, procesadores, discos-duros, estados-activo, activo-fijo, movimientos-activo-fijo, checklist y herramientas.

Dimensiones es solo lectura para usuarios del sistema:

- `GET /api/dimensiones`
- `GET /api/dimensiones/{id}`

La escritura de dimensiones queda reservada para sincronizacion SAP/job interno futuro.

Especiales: filtros de activo fijo por serial/dimension/usuario/estado, movimientos por activo, checklist download, herramientas por dimension/estado y dashboard resumen.

## Reglas funcionales vigentes

- No existe pantalla visual general llamada Maestros.
- Marca, Modelo, Procesador, Disco Duro y Estado Activo se administran desde los selectores del formulario de Nuevo Activo mediante "+ Agregar otro".
- Dimension viene desde SAP y no se crea, edita ni elimina manualmente desde frontend.
- Movimientos no tiene menu propio; se consultan en Dashboard y en el historial del detalle del activo.
- Configuracion muestra solo datos y preferencias del usuario logueado.
- Solo Admin gestiona usuarios con acceso al sistema.

## Docker

No se modifico Docker ni `docker-compose`. Queda pendiente para una etapa posterior.
