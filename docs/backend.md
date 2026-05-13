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

## Reglas de API

Dimensiones:

- Solo lectura desde frontend.
- `GET /api/dimensiones`
- `GET /api/dimensiones/{id}`
- `POST`, `PUT` y `DELETE` quedan bloqueados/reservados para sincronizacion SAP o jobs internos futuros.

Catalogos:

- Marcas, Modelos, Procesadores, Discos Duros y Estados Activo mantienen CRUD backend.
- El frontend los usa desde selectores del formulario de Nuevo Activo.

Activo Fijo:

- Permite `IdUsuario` nullable para activos sin usuario asignado.
- Permite `IdDimension`.
- Al actualizar usuario o dimension, el servicio registra movimiento.

Movimientos:

- Se mantienen endpoints backend.
- No existe menu independiente en frontend.
- Se consumen desde dashboard y detalle del activo.
