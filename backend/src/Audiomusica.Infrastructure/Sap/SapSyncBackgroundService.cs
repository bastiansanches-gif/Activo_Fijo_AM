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
        while (!stoppingToken.IsCancellationRequested)
        {
            await sapHanaService.SynchronizeAssetsAsync(stoppingToken);
            logger.LogInformation("SAP asset synchronization completed.");
            await Task.Delay(TimeSpan.FromMinutes(options.SyncIntervalMinutes), stoppingToken);
        }
    }
}
