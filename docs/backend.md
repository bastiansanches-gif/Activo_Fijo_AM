# Backend

El backend nuevo vive en `backend/src/Audiomusica.*` y compila como solucion .NET 8:

- `Audiomusica.Domain`: entidades del modelo.
- `Audiomusica.Application`: contratos y DTOs.
- `Audiomusica.Infrastructure`: EF Core, DbContext, seed y servicios.
- `Audiomusica.WebApi`: controllers, Swagger, CORS y middleware global.

Ejecutar:

```powershell
cd backend
dotnet restore Audiomusica.AssetManagement.sln
dotnet build Audiomusica.AssetManagement.sln
dotnet run --project src/Audiomusica.WebApi/Audiomusica.WebApi.csproj
```

El seed esta configurado en `AssetManagementDbContext.OnModelCreating`.
