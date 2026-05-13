using Audiomusica.Application.Contracts;
using Audiomusica.Application.DTOs;
using Audiomusica.Domain.Entities;
using Audiomusica.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Audiomusica.WebApi.Controllers;

[ApiController]
public abstract class CrudController<TEntity> : ControllerBase where TEntity : class
{
    private readonly IEntityService<TEntity> _service;

    protected CrudController(IEntityService<TEntity> service)
    {
        _service = service;
    }

    [HttpGet]
    public virtual async Task<ActionResult<IReadOnlyList<TEntity>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await _service.GetAllAsync(cancellationToken));
    }

    [HttpGet("{id:int}")]
    public virtual async Task<ActionResult<TEntity>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await _service.GetByIdAsync(id, cancellationToken);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public virtual async Task<ActionResult<TEntity>> Create(TEntity entity, CancellationToken cancellationToken)
    {
        var created = await _service.CreateAsync(entity, cancellationToken);
        return Ok(created);
    }

    [HttpPut("{id:int}")]
    public virtual async Task<ActionResult<TEntity>> Update(int id, TEntity entity, CancellationToken cancellationToken)
    {
        var updated = await _service.UpdateAsync(id, entity, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public virtual async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        return await _service.DeleteAsync(id, cancellationToken) ? NoContent() : NotFound();
    }
}

[Route("api/roles")]
public sealed class RolesController : CrudController<Rol>
{
    public RolesController(IEntityService<Rol> service) : base(service) { }
}

[Route("api/dimensiones")]
public sealed class DimensionesController : CrudController<Dimension>
{
    public DimensionesController(IEntityService<Dimension> service) : base(service) { }

    [NonAction]
    public override Task<ActionResult<Dimension>> Create(Dimension entity, CancellationToken cancellationToken)
    {
        return Task.FromResult<ActionResult<Dimension>>(StatusCode(StatusCodes.Status403Forbidden, "Las dimensiones son sincronizadas desde SAP y no pueden modificarse manualmente."));
    }

    [NonAction]
    public override Task<ActionResult<Dimension>> Update(int id, Dimension entity, CancellationToken cancellationToken)
    {
        return Task.FromResult<ActionResult<Dimension>>(StatusCode(StatusCodes.Status403Forbidden, "Las dimensiones son sincronizadas desde SAP y no pueden modificarse manualmente."));
    }

    [NonAction]
    public override Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        return Task.FromResult<IActionResult>(StatusCode(StatusCodes.Status403Forbidden, "Las dimensiones son sincronizadas desde SAP y no pueden modificarse manualmente."));
    }
}

[Route("api/usuarios")]
public sealed class UsuariosController : CrudController<Usuario>
{
    private readonly AssetManagementDbContext _db;

    public UsuariosController(IEntityService<Usuario> service, AssetManagementDbContext db) : base(service)
    {
        _db = db;
    }

    [HttpGet]
    public override async Task<ActionResult<IReadOnlyList<Usuario>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await _db.Usuarios.AsNoTracking()
            .Include(x => x.Rol)
            .Include(x => x.Dimension)
            .Include(x => x.UsuarioLicencias)
            .ThenInclude(x => x.Licencia)
            .ToListAsync(cancellationToken));
    }
}

[Route("api/cuenta")]
public sealed class CuentaController : CrudController<Cuenta>
{
    public CuentaController(IEntityService<Cuenta> service) : base(service) { }
}

[Route("api/licencias")]
public sealed class LicenciasController : CrudController<Licencia>
{
    public LicenciasController(IEntityService<Licencia> service) : base(service) { }
}

[Route("api/usuario-licencias")]
public sealed class UsuarioLicenciasController : CrudController<UsuarioLicencia>
{
    public UsuarioLicenciasController(IEntityService<UsuarioLicencia> service) : base(service) { }
}

[Route("api/marcas")]
public sealed class MarcasController : CrudController<Marca>
{
    public MarcasController(IEntityService<Marca> service) : base(service) { }
}

[Route("api/modelos")]
public sealed class ModelosController : CrudController<Modelo>
{
    public ModelosController(IEntityService<Modelo> service) : base(service) { }
}

[Route("api/procesadores")]
public sealed class ProcesadoresController : CrudController<Procesador>
{
    public ProcesadoresController(IEntityService<Procesador> service) : base(service) { }
}

[Route("api/discos-duros")]
public sealed class DiscosDurosController : CrudController<DiscoDuro>
{
    public DiscosDurosController(IEntityService<DiscoDuro> service) : base(service) { }
}

[Route("api/estados-activo")]
public sealed class EstadosActivoController : CrudController<EstadoActivo>
{
    public EstadosActivoController(IEntityService<EstadoActivo> service) : base(service) { }
}

[Route("api/activo-fijo")]
public sealed class ActivoFijoController : CrudController<ActivoFijo>
{
    private readonly AssetManagementDbContext _db;
    private readonly IEntityService<ActivoFijo> _service;

    public ActivoFijoController(IEntityService<ActivoFijo> service, AssetManagementDbContext db) : base(service)
    {
        _db = db;
        _service = service;
    }

    [HttpPost]
    public override async Task<ActionResult<ActivoFijo>> Create(ActivoFijo entity, CancellationToken cancellationToken)
    {
        ApplyOperationalRules(entity);
        var created = await _service.CreateAsync(entity, cancellationToken);
        return Ok(created);
    }

    [HttpPut("{id:int}")]
    public override async Task<ActionResult<ActivoFijo>> Update(int id, ActivoFijo entity, CancellationToken cancellationToken)
    {
        ApplyOperationalRules(entity);

        var current = await _db.ActivosFijos.FirstOrDefaultAsync(x => x.IdActivoFijo == id, cancellationToken);
        if (current is null)
        {
            return NotFound();
        }

        var previousIdDimension = current.IdDimension;
        var previousIdUsuario = current.IdUsuario;

        await using var transaction = await _db.Database.BeginTransactionAsync(cancellationToken);

        current.IdDimension = entity.IdDimension;
        current.IdUsuario = entity.IdUsuario;
        current.RAM = entity.RAM;
        current.IdMarca = entity.IdMarca;
        current.IdModelo = entity.IdModelo;
        current.IdProcesador = entity.IdProcesador;
        current.IdDiscoDuro = entity.IdDiscoDuro;
        current.Serial = entity.Serial;
        current.NumeroFactura = entity.NumeroFactura;
        current.RutProveedor = entity.RutProveedor;
        current.FechaCompra = entity.FechaCompra;
        current.Detalles = entity.Detalles;
        current.EsAF = entity.EsAF;
        current.IdUsuarioRegistro = entity.IdUsuarioRegistro;
        current.IdEstadoActivo = entity.IdEstadoActivo;
        current.Activo = entity.Activo;

        if (previousIdDimension != current.IdDimension || previousIdUsuario != current.IdUsuario)
        {
            _db.MovimientosActivoFijo.Add(new MovimientoActivoFijo
            {
                IdActivoFijo = current.IdActivoFijo,
                IdDimensionAnterior = previousIdDimension,
                IdDimensionNueva = current.IdDimension,
                IdUsuarioAnterior = previousIdUsuario,
                IdUsuarioNuevo = current.IdUsuario,
                FechaMovimiento = DateTime.UtcNow,
                Observacion = "Movimiento automatico por actualizacion de usuario o dimension."
            });
        }

        await _db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return Ok(current);
    }

    [HttpGet("serial/{serial}")]
    public async Task<ActionResult<ActivoFijo>> GetBySerial(string serial, CancellationToken cancellationToken)
    {
        var activo = await _db.ActivosFijos.AsNoTracking().FirstOrDefaultAsync(x => x.Serial == serial, cancellationToken);
        return activo is null ? NotFound() : Ok(activo);
    }

    [HttpGet("dimension/{idDimension:int}")]
    public async Task<ActionResult<IReadOnlyList<ActivoFijo>>> GetByDimension(int idDimension, CancellationToken cancellationToken)
    {
        return Ok(await _db.ActivosFijos.AsNoTracking().Where(x => x.IdDimension == idDimension).ToListAsync(cancellationToken));
    }

    [HttpGet("usuario/{idUsuario:int}")]
    public async Task<ActionResult<IReadOnlyList<ActivoFijo>>> GetByUsuario(int idUsuario, CancellationToken cancellationToken)
    {
        return Ok(await _db.ActivosFijos.AsNoTracking().Where(x => x.IdUsuario == idUsuario).ToListAsync(cancellationToken));
    }

    [HttpGet("estado/{idEstadoActivo:int}")]
    public async Task<ActionResult<IReadOnlyList<ActivoFijo>>> GetByEstado(int idEstadoActivo, CancellationToken cancellationToken)
    {
        return Ok(await _db.ActivosFijos.AsNoTracking().Where(x => x.IdEstadoActivo == idEstadoActivo).ToListAsync(cancellationToken));
    }

    private static void ApplyOperationalRules(ActivoFijo entity)
    {
        entity.EsAF = true;
    }
}

[Route("api/movimientos-activo-fijo")]
public sealed class MovimientosActivoFijoController : CrudController<MovimientoActivoFijo>
{
    private readonly AssetManagementDbContext _db;

    public MovimientosActivoFijoController(IEntityService<MovimientoActivoFijo> service, AssetManagementDbContext db) : base(service)
    {
        _db = db;
    }

    [HttpGet("activo/{idActivoFijo:int}")]
    public async Task<ActionResult<IReadOnlyList<MovimientoActivoFijo>>> GetByActivo(int idActivoFijo, CancellationToken cancellationToken)
    {
        return Ok(await _db.MovimientosActivoFijo.AsNoTracking()
            .Where(x => x.IdActivoFijo == idActivoFijo)
            .OrderByDescending(x => x.FechaMovimiento)
            .ToListAsync(cancellationToken));
    }
}

[Route("api/checklist")]
public sealed class ChecklistController : CrudController<Checklist>
{
    private readonly AssetManagementDbContext _db;
    private readonly IWebHostEnvironment _environment;

    public ChecklistController(IEntityService<Checklist> service, AssetManagementDbContext db, IWebHostEnvironment environment) : base(service)
    {
        _db = db;
        _environment = environment;
    }

    [HttpGet("{id:int}/download")]
    public async Task<IActionResult> Download(int id, CancellationToken cancellationToken)
    {
        var checklist = await _db.Checklists.AsNoTracking().FirstOrDefaultAsync(x => x.IdChecklist == id, cancellationToken);
        if (checklist is null)
        {
            return NotFound();
        }

        // Se permite descargar placeholders mientras se cargan plantillas reales en Storage/Checklists.
        var absolutePath = Path.IsPathRooted(checklist.RutaArchivo)
            ? checklist.RutaArchivo
            : Path.Combine(_environment.ContentRootPath, checklist.RutaArchivo);
        if (System.IO.File.Exists(absolutePath))
        {
            return PhysicalFile(absolutePath, "application/octet-stream", checklist.NombreArchivo);
        }

        var content = $"Plantilla pendiente de reemplazo: {checklist.NombreChecklist}";
        return File(System.Text.Encoding.UTF8.GetBytes(content), "text/plain", checklist.NombreArchivo);
    }
}

[Route("api/herramientas")]
public sealed class HerramientasController : CrudController<Herramienta>
{
    private readonly AssetManagementDbContext _db;

    public HerramientasController(IEntityService<Herramienta> service, AssetManagementDbContext db) : base(service)
    {
        _db = db;
    }

    [HttpGet("dimension/{idDimension:int}")]
    public async Task<ActionResult<IReadOnlyList<Herramienta>>> GetByDimension(int idDimension, CancellationToken cancellationToken)
    {
        return Ok(await _db.Herramientas.AsNoTracking().Where(x => x.IdDimension == idDimension).ToListAsync(cancellationToken));
    }

    [HttpGet("estado/{estado}")]
    public async Task<ActionResult<IReadOnlyList<Herramienta>>> GetByEstado(string estado, CancellationToken cancellationToken)
    {
        return Ok(await _db.Herramientas.AsNoTracking().Where(x => x.Estado == estado).ToListAsync(cancellationToken));
    }
}

[Route("api/dashboard")]
public sealed class DashboardController : ControllerBase
{
    private readonly AssetManagementDbContext _db;

    public DashboardController(AssetManagementDbContext db)
    {
        _db = db;
    }

    [HttpGet("resumen")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary(CancellationToken cancellationToken)
    {
        var asignado = await _db.EstadosActivo.AsNoTracking()
            .Where(x => x.NombreEstado == "Disponible")
            .Select(x => x.IdEstadoActivo)
            .FirstOrDefaultAsync(cancellationToken);

        return Ok(new DashboardSummaryDto(
            await _db.ActivosFijos.CountAsync(x => x.Activo, cancellationToken),
            await _db.ActivosFijos.CountAsync(x => x.Activo && x.IdEstadoActivo == asignado, cancellationToken),
            await _db.Usuarios.CountAsync(x => x.Activo, cancellationToken),
            await _db.Herramientas.CountAsync(x => x.Activo, cancellationToken),
            await _db.MovimientosActivoFijo.CountAsync(cancellationToken),
            await _db.Checklists.CountAsync(cancellationToken)));
    }
}
