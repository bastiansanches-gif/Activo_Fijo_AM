namespace Audiomusica.Infrastructure.Sap;

public class SapOptions
{
    // Esta seccion se lee desde appsettings.json con la llave "Sap".
    // Ejemplo de configuracion:
    // "Sap": {
    //   "ConnectionString": "ServerNode=servidor-hana:30015;UID=usuario;PWD=password;ENCRYPT=TRUE;",
    //   "SyncIntervalMinutes": 60
    // }
    //
    // Para SAP HANA Cloud normalmente se usa puerto 443 y ENCRYPT=TRUE.
    // Para SAP HANA on-premise el puerto suele ser 3<instancia>15, por ejemplo 30015.
    public const string SectionName = "Sap";

    // Cadena de conexion del cliente SAP HANA.
    // No guardar credenciales reales en git: usar variables de entorno, secrets de .NET,
    // Azure Key Vault, AWS Secrets Manager u otro mecanismo seguro segun el ambiente.
    public string ConnectionString { get; set; } = string.Empty;

    // Frecuencia con la que el job interno consultaria SAP para sincronizar activos/dimensiones.
    public int SyncIntervalMinutes { get; set; } = 60;
}
