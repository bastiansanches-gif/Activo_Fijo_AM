namespace Audiomusica.Infrastructure.Sap;

public class SapOptions
{
    public const string SectionName = "Sap";

    public string ConnectionString { get; set; } = string.Empty;
    public int SyncIntervalMinutes { get; set; } = 60;
}
