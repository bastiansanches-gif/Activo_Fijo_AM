using Audiomusica.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Audiomusica.WebApi.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    private readonly AssetManagementDbContext _dbContext;
    private readonly ILogger<HealthController> _logger;

    public HealthController(AssetManagementDbContext dbContext, ILogger<HealthController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [HttpGet("database")]
    public async Task<IActionResult> Database(CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Opening SQL Server connection for database health check.");

            await _dbContext.Database.OpenConnectionAsync(cancellationToken);

            _logger.LogInformation("SQL Server connection opened successfully.");
            _logger.LogInformation("SQL Server connection successful for database health check.");

            return Ok(new { database = "online" });
        }
        catch (SqlException exception) when (exception.Number == 18456)
        {
            _logger.LogError(exception, "SQL Server login failed for configured application user.");
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { database = "offline", error = exception.Message });
        }
        catch (SqlException exception) when (exception.Number == -2)
        {
            _logger.LogError(exception, "SQL Server connection timeout during database health check.");
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { database = "offline", error = exception.Message });
        }
        catch (TimeoutException exception)
        {
            _logger.LogError(exception, "SQL Server connection timeout during database health check.");
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { database = "offline", error = exception.Message });
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "SQL Server database health check failed.");
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { database = "offline", error = exception.Message });
        }
        finally
        {
            await _dbContext.Database.CloseConnectionAsync();
        }
    }
}
