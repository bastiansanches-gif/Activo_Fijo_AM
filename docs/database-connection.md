# Conexion de base de datos

## Arquitectura actual

Fase 1 usa SQL Server Express 2022 instalado en Windows Server 2019.

- Servidor Windows: `128.10.68.30`
- Instancia local Windows: `SQLEXPRESS`
- Puerto TCP: `1433`
- Base de datos: `AudiomusicaAssetManagementDb`
- Login de aplicacion: `audiomusica_app`

El backend .NET puede ejecutarse localmente o en Linux y conectarse a este SQL Server remoto.

SAP HANA insertara datos en esta misma base por procesos externos. La aplicacion todavia no tiene conexion directa a SAP HANA.

## Fases futuras

- Fase 2: migracion futura a SQL Server licenciado.
- Fase 3: conexion directa futura con SAP HANA desde servicios internos de la aplicacion.

## Connection strings

Desarrollo local en Windows, usando la instancia local:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=AudiomusicaAssetManagementDb;User Id=audiomusica_app;Password=Amsa.2026#;TrustServerCertificate=True;Encrypt=False;"
  }
}
```

Produccion o Linux/server, usando IP y puerto:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=128.10.68.30,1433;Database=AudiomusicaAssetManagementDb;User Id=audiomusica_app;Password=Amsa.2026#;TrustServerCertificate=True;Encrypt=False;"
  }
}
```

No usar `sa` en la aplicacion. Usar siempre `audiomusica_app`.

## Variable de entorno

ASP.NET Core permite sobrescribir claves jerarquicas con doble guion bajo. En produccion se puede reemplazar la conexion sin modificar `appsettings.Production.json`:

```env
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Server=128.10.68.30,1433;Database=AudiomusicaAssetManagementDb;User Id=audiomusica_app;Password=CAMBIAR_PASSWORD;TrustServerCertificate=True;Encrypt=False;
```

El backend usa `builder.Configuration.GetConnectionString("DefaultConnection")` en `Program.cs`.

## Probar conectividad

Desde Windows Server:

```powershell
Test-NetConnection localhost -Port 1433
```

Desde Linux:

```bash
nc -zv 128.10.68.30 1433
```

## Migraciones EF Core

Para aplicar migraciones:

```powershell
cd backend
dotnet ef database update --project src/Audiomusica.Infrastructure --startup-project src/Audiomusica.WebApi
```

Durante la ejecucion de migraciones EF Core, el usuario `audiomusica_app` debe tener temporalmente:

- `db_datareader`
- `db_datawriter`
- `db_ddladmin`

Despues de aplicar migraciones, revisar si `db_ddladmin` sigue siendo necesario para el runtime normal.

## Ejecutar backend

```powershell
cd backend
dotnet run --project src/Audiomusica.WebApi/Audiomusica.WebApi.csproj
```

## Probar Swagger

Abrir la URL informada por Kestrel y agregar `/swagger`:

```text
http://localhost:<PUERTO_BACKEND>/swagger
```

Ejemplos comunes:

```text
https://localhost:5001/swagger
http://localhost:5000/swagger
```

## Docker opcional

La configuracion Docker de SQL Server queda solo como alternativa de desarrollo aislado. No es el flujo principal de la arquitectura actual y no representa el ambiente productivo de Fase 1.
