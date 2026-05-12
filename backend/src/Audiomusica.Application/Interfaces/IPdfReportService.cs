namespace Audiomusica.Application.Interfaces;

public interface IPdfReportService
{
    Task<byte[]> GenerateAssetReportAsync(Guid assetId, CancellationToken cancellationToken = default);
}
