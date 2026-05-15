# Autenticacion SQL Server

El backend .NET usa SQL Server Authentication contra la base centralizada `AudiomusicaAssetManagementDb`.

## Conexion configurada

Development:

```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=AudiomusicaAssetManagementDb;User Id=audiomusica_app;Password=Amsa.2026#;TrustServerCertificate=True;Encrypt=False;"
```

Production:

```json
"DefaultConnection": "Server=128.10.68.30,1433;Database=AudiomusicaAssetManagementDb;User Id=audiomusica_app;Password=Amsa.2026#;TrustServerCertificate=True;Encrypt=False;"
```

El backend lee la cadena con:

```csharp
builder.Configuration.GetConnectionString("DefaultConnection")
```

En Linux/produccion se puede sobrescribir con la variable de entorno:

```powershell
ConnectionStrings__DefaultConnection="Server=128.10.68.30,1433;Database=AudiomusicaAssetManagementDb;User Id=audiomusica_app;Password=Amsa.2026#;TrustServerCertificate=True;Encrypt=False;"
```

## Probar en SSMS

1. Abrir SQL Server Management Studio.
2. Server name local: `localhost\SQLEXPRESS`.
3. Server name remoto: `128.10.68.30,1433`.
4. Authentication: `SQL Server Authentication`.
5. Login: `audiomusica_app`.
6. Password: `Amsa.2026#`.
7. Conectar y abrir la base `AudiomusicaAssetManagementDb`.

Si el login no existe, ejecutar primero `docs/sql/create-app-user.sql` con un usuario administrador de SQL Server.

## Aplicar migraciones EF Core

Desde `backend`:

```powershell
dotnet ef database update --project src/Audiomusica.Infrastructure --startup-project src/Audiomusica.WebApi
```

Si se ejecuta desde Linux, usar la misma ruta relativa y exportar antes `ASPNETCORE_ENVIRONMENT=Production` o `ConnectionStrings__DefaultConnection`.

## Correr backend

Desde `backend`:

```powershell
dotnet run --project src/Audiomusica.WebApi
```

Health check de base de datos:

```powershell
curl http://localhost:5000/api/health/database
```

Respuesta esperada:

```json
{
  "database": "online"
}
```
