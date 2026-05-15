# SQL Server en Docker para desarrollo opcional

Este entorno levanta solo SQL Server en Docker. El backend .NET se ejecuta localmente con `dotnet run`.

Esta guia queda solo como alternativa de desarrollo aislado. No es el flujo principal de la arquitectura actual.

Fase 1 usa SQL Server Express 2022 en Windows Server 2019. Ver `docs/database-connection.md`.

## Requisitos

- Docker Desktop o Docker Engine con Docker Compose.
- .NET SDK 8.
- Herramienta EF Core disponible para ejecutar `dotnet ef`.

## Configuracion

Desde la raiz del repositorio, crear el archivo `.env` a partir del ejemplo:

```powershell
Copy-Item .env.example .env
```

El compose usa esta variable:

```env
MSSQL_SA_PASSWORD=Audiomusica_12345!
```

Si se usa Docker de forma opcional, ajustar temporalmente `DefaultConnection` en `backend/src/Audiomusica.WebApi/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=AudiomusicaAssetManagementDb;User Id=audiomusica_app;Password=CAMBIAR_PASSWORD;TrustServerCertificate=True;Encrypt=False;"
  }
}
```

No usar `sa` como usuario de aplicacion. Si se usa este entorno opcional, crear primero un login de aplicacion equivalente a `audiomusica_app`.

El `DbContext` esta configurado en `backend/src/Audiomusica.WebApi/Program.cs` con `GetConnectionString("DefaultConnection")`.

## Levantar base de datos

Desde la raiz del repositorio:

```powershell
docker compose up -d
docker ps
```

## Aplicar migraciones

Desde la carpeta `backend`:

```powershell
dotnet ef database update --project src/Audiomusica.Infrastructure --startup-project src/Audiomusica.WebApi
```

## Ejecutar backend local

Desde la carpeta `backend`:

```powershell
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
