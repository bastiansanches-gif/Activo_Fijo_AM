using Audiomusica.Application.Interfaces;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Audiomusica.Infrastructure.Sap;

public class SapSyncBackgroundService : BackgroundService
{
    private readonly ISapHanaService sapHanaService;
    private readonly SapOptions options;
    private readonly ILogger<SapSyncBackgroundService> logger;

    public SapSyncBackgroundService(
        ISapHanaService sapHanaService,
        IOptions<SapOptions> options,
        ILogger<SapSyncBackgroundService> logger)
    {
        this.sapHanaService = sapHanaService;
        this.options = options.Value;
        this.logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Este BackgroundService es el lugar pensado para ejecutar la sincronizacion
        // automatica contra SAP. Antes de habilitarlo en Program.cs, revisar que:
        // - Sap:ConnectionString exista y apunte al ambiente correcto.
        // - El servidor tenga instalado/configurado el SAP HANA Client.
        // - Las consultas usadas por SapHanaService sean de solo lectura o esten
        //   alineadas con el proceso SAP aprobado.
        while (!stoppingToken.IsCancellationRequested)
        {
            await sapHanaService.SynchronizeAssetsAsync(stoppingToken);
            logger.LogInformation("SAP asset synchronization completed.");
            await Task.Delay(TimeSpan.FromMinutes(options.SyncIntervalMinutes), stoppingToken);
        }
    }
}
