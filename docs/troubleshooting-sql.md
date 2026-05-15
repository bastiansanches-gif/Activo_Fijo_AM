# Troubleshooting SQL Server

## Error 18456 / Login failed

El error `18456` indica que SQL Server rechazo el login.

Revisar:

- El servidor esta en Mixed Mode: `SQL Server and Windows Authentication mode`.
- Existe el login `audiomusica_app` en `Security > Logins`.
- Existe el usuario `audiomusica_app` dentro de `AudiomusicaAssetManagementDb`.
- La password configurada coincide con `Amsa.2026#`.
- El login no esta deshabilitado ni bloqueado por policy.

Script de reparacion:

```sql
ALTER LOGIN [audiomusica_app] ENABLE;
ALTER LOGIN [audiomusica_app] WITH PASSWORD = N'Amsa.2026#' UNLOCK;
```

## Puerto 1433

La conexion productiva usa `128.10.68.30,1433`.

Validar desde el cliente:

```powershell
Test-NetConnection 128.10.68.30 -Port 1433
```

Si falla, revisar que SQL Server escuche en TCP/IP y que el firewall permita entrada por `1433`.

## SQL Browser

Para conexiones por nombre de instancia, como `localhost\SQLEXPRESS`, SQL Browser ayuda a resolver el puerto dinamico de la instancia.

En esta arquitectura productiva se usa puerto fijo `1433`, por lo que Linux debe conectar con `Server=128.10.68.30,1433` y no depender de SQL Browser.

## Mixed Mode

SQL Authentication requiere Mixed Mode.

En SSMS:

1. Click derecho sobre el servidor.
2. Properties.
3. Security.
4. Seleccionar `SQL Server and Windows Authentication mode`.
5. Reiniciar el servicio SQL Server.

## Firewall

Permitir entrada TCP `1433` en Windows Defender Firewall o firewall perimetral.

Tambien revisar reglas de red entre Linux y Windows Server 2019:

- IP destino: `128.10.68.30`.
- Puerto destino: `1433`.
- Protocolo: TCP.
- Servicio SQL Server Express iniciado.

## Timeout

Un timeout suele indicar bloqueo de red, puerto incorrecto, servicio detenido o SQL Server sin TCP/IP habilitado.

Revisar en SQL Server Configuration Manager:

- `SQL Server Network Configuration`.
- `Protocols for SQLEXPRESS`.
- `TCP/IP` habilitado.
- Puerto TCP fijo `1433`.
- Reiniciar servicio `SQL Server (SQLEXPRESS)`.
