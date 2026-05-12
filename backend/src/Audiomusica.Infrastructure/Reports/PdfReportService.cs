using Audiomusica.Application.Interfaces;

namespace Audiomusica.Infrastructure.Reports;

public class PdfReportService : IPdfReportService
{
    public Task<byte[]> GenerateAssetReportAsync(Guid assetId, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(Array.Empty<byte>());
    }
}
