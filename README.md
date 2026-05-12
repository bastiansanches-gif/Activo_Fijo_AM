# Audiomusica Asset Management

Sistema para gestion de activos fijos, usuarios, dimensiones, checklist, movimientos y herramientas de informatica.

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

Endpoints CRUD: roles, dimensiones, usuarios, cuenta, marcas, modelos, procesadores, discos-duros, estados-activo, activo-fijo, movimientos-activo-fijo, checklist y herramientas.

Especiales: filtros de activo fijo por serial/dimension/usuario/estado, movimientos por activo, checklist download, herramientas por dimension/estado y dashboard resumen.

## Docker

No se modifico Docker ni `docker-compose`. Queda pendiente para una etapa posterior.
