using Audiomusica.Application.Contracts;
using Audiomusica.Infrastructure.Persistence;
using Audiomusica.Infrastructure.Services;
using Audiomusica.WebApi.Middleware;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Text.Json;
using System.Text.Json.Serialization;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);
    builder.Host.UseSerilog();

    builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("Frontend", policy =>
        {
            var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                ?? ["http://localhost:3000"];
            policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod();
        });
    });

    builder.Services.AddDbContext<AssetManagementDbContext>(options =>
    {
        // ASP.NET Core permite sobrescribir esta cadena con la variable de entorno
        // ConnectionStrings__DefaultConnection en Linux/produccion.
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    });
    builder.Services.AddScoped(typeof(IEntityService<>), typeof(EntityService<>));

    // Conexion SAP HANA:
    // El proyecto ya tiene clases base en Infrastructure/Sap para una sincronizacion futura.
    // Cuando se implemente la conexion real, registrar aqui las opciones y servicios:
    //
    // builder.Services.Configure<SapOptions>(
    //     builder.Configuration.GetSection(SapOptions.SectionName));
    // builder.Services.AddScoped<ISapHanaService, SapHanaService>();
    // builder.Services.AddHostedService<SapSyncBackgroundService>();
    //
    // Para que ese registro compile, agregar los using correspondientes y asegurarse de
    // que Audiomusica.Infrastructure.csproj incluya los archivos de la carpeta Sap.
    // La cadena se configura en appsettings.json:
    // "Sap": {
    //   "ConnectionString": "ServerNode=servidor-hana:30015;UID=usuario;PWD=password;ENCRYPT=TRUE;",
    //   "SyncIntervalMinutes": 60
    // }

    var app = builder.Build();

    app.UseMiddleware<GlobalExceptionMiddleware>();
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseCors("Frontend");
    app.UseHttpsRedirection();
    app.MapControllers();

    if (builder.Configuration.GetValue<bool>("Database:ApplyMigrations"))
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AssetManagementDbContext>();
        const int maxAttempts = 30;

        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            try
            {
                Log.Information("Applying pending database migrations. Attempt {Attempt}/{MaxAttempts}.", attempt, maxAttempts);
                await dbContext.Database.MigrateAsync();
                Log.Information("Database migrations applied.");
                break;
            }
            catch (Exception exception) when (attempt < maxAttempts)
            {
                Log.Warning(exception, "Database migration attempt failed. Retrying in 5 seconds.");
                await Task.Delay(TimeSpan.FromSeconds(5));
            }
        }
    }

    app.Run();
}
catch (Exception exception)
{
    if (exception.GetType().Name == "HostAbortedException")
    {
        throw;
    }

    Log.Fatal(exception, "Audiomusica WebApi terminated unexpectedly.");
    throw;
}
finally
{
    Log.CloseAndFlush();
}

public partial class Program;
