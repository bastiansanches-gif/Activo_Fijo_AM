using Audiomusica.Application.Interfaces;

namespace Audiomusica.Infrastructure.Sap;

public class SapHanaService : ISapHanaService
{
    public Task SynchronizeAssetsAsync(CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}
