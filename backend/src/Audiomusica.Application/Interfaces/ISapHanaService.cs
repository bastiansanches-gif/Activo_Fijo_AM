namespace Audiomusica.Application.Interfaces;

public interface ISapHanaService
{
    Task SynchronizeAssetsAsync(CancellationToken cancellationToken = default);
}
