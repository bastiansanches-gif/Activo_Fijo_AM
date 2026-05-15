using Audiomusica.Application.DTOs;
using Audiomusica.Domain.Entities;
using Audiomusica.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Audiomusica.WebApi.Controllers;

[ApiController]
public abstract class DtoCrudController<TEntity, TCreateDto, TUpdateDto, TResponseDto> : ControllerBase
    where TEntity : class
{
    protected readonly AssetManagementDbContext Db;

    protected DtoCrudController(AssetManagementDbContext db)
    {
        Db = db;
    }

    [HttpGet]
    public virtual async Task<ActionResult<IReadOnlyList<TResponseDto>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await Db.Set<TEntity>().AsNoTracking().ToListAsync(cancellationToken);
        return Ok(items.Select(ToResponse).ToList());
    }

    [HttpGet("{id:int}")]
    public virtual async Task<ActionResult<TResponseDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var item = await Db.Set<TEntity>().FindAsync([id], cancellationToken);
        return item is null ? NotFound() : Ok(ToResponse(item));
    }

    [HttpPost]
    public virtual async Task<ActionResult<TResponseDto>> Create([FromBody] TCreateDto dto, CancellationToken cancellationToken)
    {
        var validationError = await ValidateCreateAsync(dto, cancellationToken);
        if (validationError is not null)
        {
            return validationError;
        }

        var entity = FromCreate(dto);
        Db.Set<TEntity>().Add(entity);
        await Db.SaveChangesAsync(cancellationToken);
        return Ok(ToResponse(entity));
    }

    [HttpPut("{id:int}")]
    public virtual async Task<ActionResult<TResponseDto>> Update(int id, [FromBody] TUpdateDto dto, CancellationToken cancellationToken)
    {
        var entity = await Db.Set<TEntity>().FindAsync([id], cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        var validationError = await ValidateUpdateAsync(id, dto, cancellationToken);
        if (validationError is not null)
        {
            return validationError;
        }

        ApplyUpdate(entity, dto);
        await Db.SaveChangesAsync(cancellationToken);
        return Ok(ToResponse(entity));
    }

    [HttpDelete("{id:int}")]
    public virtual async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var entity = await Db.Set<TEntity>().FindAsync([id], cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        if (entity is IHasActivo softDelete)
        {
            softDelete.Activo = false;
        }
        else
        {
            Db.Set<TEntity>().Remove(entity);
        }

        await Db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    protected virtual Task<ActionResult?> ValidateCreateAsync(TCreateDto dto, CancellationToken cancellationToken)
    {
        return Task.FromResult<ActionResult?>(null);
    }

    protected virtual Task<ActionResult?> ValidateUpdateAsync(int id, TUpdateDto dto, CancellationToken cancellationToken)
    {
        return Task.FromResult<ActionResult?>(null);
    }

    protected abstract TEntity FromCreate(TCreateDto dto);
    protected abstract void ApplyUpdate(TEntity entity, TUpdateDto dto);
    protected abstract TResponseDto ToResponse(TEntity entity);
}

[Route("api/roles")]
public sealed class RolesController : DtoCrudController<Rol, CreateRolDto, UpdateRolDto, RolResponseDto>
{
    public RolesController(AssetManagementDbContext db) : base(db) { }
    protected override Rol FromCreate(CreateRolDto dto) => new() { NombreRol = dto.NombreRol.Trim() };
    protected override void ApplyUpdate(Rol entity, UpdateRolDto dto) => entity.NombreRol = dto.NombreRol.Trim();
    protected override RolResponseDto ToResponse(Rol entity) => new(entity.IdRol, entity.NombreRol);
}

[Route("api/dimensiones")]
public sealed class DimensionesController : DtoCrudController<Dimension, CreateDimensionDto, UpdateDimensionDto, DimensionResponseDto>
{
    public DimensionesController(AssetManagementDbContext db) : base(db) { }
    protected override Dimension FromCreate(CreateDimensionDto dto) => new() { NumeroDimension = dto.NumeroDimension.Trim(), NombreDimension = dto.NombreDimension.Trim(), Activo = dto.Activo };
    protected override void ApplyUpdate(Dimension entity, UpdateDimensionDto dto) { entity.NumeroDimension = dto.NumeroDimension.Trim(); entity.NombreDimension = dto.NombreDimension.Trim(); entity.Activo = dto.Activo; }
    protected override DimensionResponseDto ToResponse(Dimension entity) => new(entity.IdDimension, entity.NumeroDimension, entity.NombreDimension, entity.Activo);
}

[Route("api/cuentas")]
public sealed class CuentasController : DtoCrudController<Cuenta, CreateCuentaDto, UpdateCuentaDto, CuentaResponseDto>
{
    public CuentasController(AssetManagementDbContext db) : base(db) { }
    protected override Cuenta FromCreate(CreateCuentaDto dto) => new() { NombreCuenta = dto.NombreCuenta.Trim() };
    protected override void ApplyUpdate(Cuenta entity, UpdateCuentaDto dto) => entity.NombreCuenta = dto.NombreCuenta.Trim();
    protected override CuentaResponseDto ToResponse(Cuenta entity) => new(entity.IdCuenta, entity.NombreCuenta);
}

[Route("api/usuario-cuentas")]
public sealed class UsuarioCuentasController : DtoCrudController<UsuarioCuenta, CreateUsuarioCuentaDto, UpdateUsuarioCuentaDto, UsuarioCuentaResponseDto>
{
    public UsuarioCuentasController(AssetManagementDbContext db) : base(db) { }

    protected override async Task<ActionResult?> ValidateCreateAsync(CreateUsuarioCuentaDto dto, CancellationToken cancellationToken)
    {
        return await ValidateReferencesAsync(dto.IdUsuario, dto.IdCuenta, cancellationToken);
    }

    protected override async Task<ActionResult?> ValidateUpdateAsync(int id, UpdateUsuarioCuentaDto dto, CancellationToken cancellationToken)
    {
        return await ValidateReferencesAsync(dto.IdUsuario, dto.IdCuenta, cancellationToken);
    }

    protected override UsuarioCuenta FromCreate(CreateUsuarioCuentaDto dto) => new() { IdUsuario = dto.IdUsuario, IdCuenta = dto.IdCuenta };
    protected override void ApplyUpdate(UsuarioCuenta entity, UpdateUsuarioCuentaDto dto) { entity.IdUsuario = dto.IdUsuario; entity.IdCuenta = dto.IdCuenta; }
    protected override UsuarioCuentaResponseDto ToResponse(UsuarioCuenta entity) => new(entity.IdUsuarioCuenta, entity.IdUsuario, entity.IdCuenta, entity.Cuenta?.NombreCuenta);

    private async Task<ActionResult?> ValidateReferencesAsync(int idUsuario, int idCuenta, CancellationToken cancellationToken)
    {
        if (!await Db.Usuarios.AnyAsync(x => x.IdUsuario == idUsuario, cancellationToken))
        {
            return BadRequest("IdUsuario no existe.");
        }

        if (!await Db.Cuentas.AnyAsync(x => x.IdCuenta == idCuenta, cancellationToken))
        {
            return BadRequest("IdCuenta no existe.");
        }

        return null;
    }
}

[Route("api/usuarios")]
public sealed class UsuariosController : ControllerBase
{
    private readonly AssetManagementDbContext _db;

    public UsuariosController(AssetManagementDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UsuarioResponseDto>>> GetAll(CancellationToken cancellationToken)
    {
        var usuarios = await UsuarioQuery().ToListAsync(cancellationToken);
        return Ok(usuarios.Select(ToResponse).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UsuarioResponseDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var usuario = await UsuarioQuery().FirstOrDefaultAsync(x => x.IdUsuario == id, cancellationToken);
        return usuario is null ? NotFound() : Ok(ToResponse(usuario));
    }

    [HttpPost]
    public async Task<ActionResult<UsuarioResponseDto>> Create([FromBody] CreateUsuarioDto dto, CancellationToken cancellationToken)
    {
        var validationError = await ValidateUsuarioAsync(dto.Rut, dto.IdRol, dto.IdDimension, dto.IdCuentas, null, cancellationToken);
        if (validationError is not null)
        {
            return validationError;
        }

        await using var transaction = await _db.Database.BeginTransactionAsync(cancellationToken);

        var usuario = new Usuario
        {
            Rut = dto.Rut.Trim(),
            NombreUsuario = dto.NombreUsuario.Trim(),
            ApellidoPaterno = dto.ApellidoPaterno.Trim(),
            ApellidoMaterno = Normalize(dto.ApellidoMaterno),
            CorreoCorporativo = dto.CorreoCorporativo.Trim(),
            FechaIngreso = dto.FechaIngreso,
            FinContrato = dto.FinContrato,
            IdRol = dto.IdRol,
            IdDimension = dto.IdDimension,
            Activo = dto.Activo
        };

        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync(cancellationToken);
        SyncUsuarioCuentas(usuario.IdUsuario, dto.IdCuentas);
        await _db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return Ok(ToResponse(await LoadUsuarioAsync(usuario.IdUsuario, cancellationToken)));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UsuarioResponseDto>> Update(int id, [FromBody] UpdateUsuarioDto dto, CancellationToken cancellationToken)
    {
        var usuario = await _db.Usuarios.Include(x => x.UsuarioCuentas).FirstOrDefaultAsync(x => x.IdUsuario == id, cancellationToken);
        if (usuario is null)
        {
            return NotFound();
        }

        var validationError = await ValidateUsuarioAsync(dto.Rut, dto.IdRol, dto.IdDimension, dto.IdCuentas, id, cancellationToken);
        if (validationError is not null)
        {
            return validationError;
        }

        await using var transaction = await _db.Database.BeginTransactionAsync(cancellationToken);

        usuario.Rut = dto.Rut.Trim();
        usuario.NombreUsuario = dto.NombreUsuario.Trim();
        usuario.ApellidoPaterno = dto.ApellidoPaterno.Trim();
        usuario.ApellidoMaterno = Normalize(dto.ApellidoMaterno);
        usuario.CorreoCorporativo = dto.CorreoCorporativo.Trim();
        usuario.FechaIngreso = dto.FechaIngreso;
        usuario.FinContrato = dto.FinContrato;
        usuario.IdRol = dto.IdRol;
        usuario.IdDimension = dto.IdDimension;
        usuario.Activo = dto.Activo;

        SyncUsuarioCuentas(usuario.IdUsuario, dto.IdCuentas);
        await _db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return Ok(ToResponse(await LoadUsuarioAsync(usuario.IdUsuario, cancellationToken)));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var usuario = await _db.Usuarios.FindAsync([id], cancellationToken);
        if (usuario is null)
        {
            return NotFound();
        }

        usuario.Activo = false;
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private IQueryable<Usuario> UsuarioQuery()
    {
        return _db.Usuarios.AsNoTracking()
            .Include(x => x.Rol)
            .Include(x => x.Dimension)
            .Include(x => x.UsuarioCuentas)
            .ThenInclude(x => x.Cuenta);
    }

    private async Task<Usuario> LoadUsuarioAsync(int idUsuario, CancellationToken cancellationToken)
    {
        return await UsuarioQuery().FirstAsync(x => x.IdUsuario == idUsuario, cancellationToken);
    }

    private async Task<ActionResult?> ValidateUsuarioAsync(string rut, int idRol, int idDimension, int[]? idCuentas, int? currentId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(rut))
        {
            return BadRequest("Rut es obligatorio.");
        }

        var normalizedRut = rut.Trim();
        var rutExists = await _db.Usuarios.AnyAsync(
            x => x.Rut == normalizedRut && (currentId == null || x.IdUsuario != currentId),
            cancellationToken);
        if (rutExists)
        {
            return BadRequest("Ya existe un usuario registrado con este RUT.");
        }

        if (!await _db.Roles.AnyAsync(x => x.IdRol == idRol, cancellationToken))
        {
            return BadRequest($"IdRol no existe: {idRol}.");
        }

        if (!await _db.Dimensiones.AnyAsync(x => x.IdDimension == idDimension, cancellationToken))
        {
            return BadRequest("IdDimension no existe.");
        }

        var distinctCuentaIds = (idCuentas ?? []).Distinct().ToArray();
        var existingCuentaIds = await _db.Cuentas
            .Where(x => distinctCuentaIds.Contains(x.IdCuenta))
            .Select(x => x.IdCuenta)
            .ToListAsync(cancellationToken);
        var missingCuentaIds = distinctCuentaIds.Except(existingCuentaIds).ToArray();
        if (missingCuentaIds.Length > 0)
        {
            return BadRequest($"IdCuentas contiene cuentas inexistentes: {string.Join(", ", missingCuentaIds)}.");
        }

        return null;
    }

    private void SyncUsuarioCuentas(int idUsuario, int[]? idCuentas)
    {
        var requestedIds = (idCuentas ?? []).Distinct().ToHashSet();
        var current = _db.UsuarioCuentas.Where(x => x.IdUsuario == idUsuario).ToList();
        var toRemove = current.Where(x => !requestedIds.Contains(x.IdCuenta)).ToList();
        var currentIds = current.Select(x => x.IdCuenta).ToHashSet();
        var toAdd = requestedIds.Except(currentIds).Select(idCuenta => new UsuarioCuenta { IdUsuario = idUsuario, IdCuenta = idCuenta });

        _db.UsuarioCuentas.RemoveRange(toRemove);
        _db.UsuarioCuentas.AddRange(toAdd);
    }

    private static UsuarioResponseDto ToResponse(Usuario usuario)
    {
        return new UsuarioResponseDto(
            usuario.IdUsuario,
            usuario.Rut,
            usuario.NombreUsuario,
            usuario.ApellidoPaterno,
            usuario.ApellidoMaterno,
            usuario.CorreoCorporativo,
            usuario.FechaIngreso,
            usuario.FinContrato,
            usuario.IdRol,
            usuario.Rol?.NombreRol,
            usuario.IdDimension,
            usuario.Dimension?.NombreDimension,
            usuario.Activo,
            usuario.UsuarioCuentas
                .Where(x => x.Cuenta is not null)
                .Select(x => new UsuarioCuentaItemDto(x.IdCuenta, x.Cuenta!.NombreCuenta))
                .OrderBy(x => x.IdCuenta)
                .ToList());
    }

    private static string? Normalize(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}

[Route("api/marcas")]
public sealed class MarcasController : DtoCrudController<Marca, CreateMarcaDto, UpdateMarcaDto, MarcaResponseDto>
{
    public MarcasController(AssetManagementDbContext db) : base(db) { }
    protected override Marca FromCreate(CreateMarcaDto dto) => new() { NombreMarca = dto.NombreMarca.Trim() };
    protected override void ApplyUpdate(Marca entity, UpdateMarcaDto dto) => entity.NombreMarca = dto.NombreMarca.Trim();
    protected override MarcaResponseDto ToResponse(Marca entity) => new(entity.IdMarca, entity.NombreMarca);
}

[Route("api/modelos")]
public sealed class ModelosController : DtoCrudController<Modelo, CreateModeloDto, UpdateModeloDto, ModeloResponseDto>
{
    public ModelosController(AssetManagementDbContext db) : base(db) { }

    public override async Task<ActionResult<IReadOnlyList<ModeloResponseDto>>> GetAll(CancellationToken cancellationToken)
    {
        var modelos = await _modelos().ToListAsync(cancellationToken);
        return Ok(modelos.Select(ToResponse).ToList());
    }

    public override async Task<ActionResult<ModeloResponseDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var modelo = await _modelos().FirstOrDefaultAsync(x => x.IdModelo == id, cancellationToken);
        return modelo is null ? NotFound() : Ok(ToResponse(modelo));
    }

    protected override async Task<ActionResult?> ValidateCreateAsync(CreateModeloDto dto, CancellationToken cancellationToken) => await ValidateMarcaAsync(dto.IdMarca, cancellationToken);
    protected override async Task<ActionResult?> ValidateUpdateAsync(int id, UpdateModeloDto dto, CancellationToken cancellationToken) => await ValidateMarcaAsync(dto.IdMarca, cancellationToken);
    protected override Modelo FromCreate(CreateModeloDto dto) => new() { IdMarca = dto.IdMarca, NombreModelo = dto.NombreModelo.Trim() };
    protected override void ApplyUpdate(Modelo entity, UpdateModeloDto dto) { entity.IdMarca = dto.IdMarca; entity.NombreModelo = dto.NombreModelo.Trim(); }
    protected override ModeloResponseDto ToResponse(Modelo entity) => new(entity.IdModelo, entity.IdMarca, entity.Marca?.NombreMarca, entity.NombreModelo);

    private IQueryable<Modelo> _modelos() => Db.Modelos.AsNoTracking().Include(x => x.Marca);
    private async Task<ActionResult?> ValidateMarcaAsync(int idMarca, CancellationToken cancellationToken) => await Db.Marcas.AnyAsync(x => x.IdMarca == idMarca, cancellationToken) ? null : BadRequest("IdMarca no existe.");
}

[Route("api/procesadores")]
public sealed class ProcesadoresController : DtoCrudController<Procesador, CreateProcesadorDto, UpdateProcesadorDto, ProcesadorResponseDto>
{
    public ProcesadoresController(AssetManagementDbContext db) : base(db) { }
    protected override Procesador FromCreate(CreateProcesadorDto dto) => new() { NombreProcesador = dto.NombreProcesador.Trim() };
    protected override void ApplyUpdate(Procesador entity, UpdateProcesadorDto dto) => entity.NombreProcesador = dto.NombreProcesador.Trim();
    protected override ProcesadorResponseDto ToResponse(Procesador entity) => new(entity.IdProcesador, entity.NombreProcesador);
}

[Route("api/discos-duros")]
public sealed class DiscosDurosController : DtoCrudController<DiscoDuro, CreateDiscoDuroDto, UpdateDiscoDuroDto, DiscoDuroResponseDto>
{
    public DiscosDurosController(AssetManagementDbContext db) : base(db) { }
    protected override DiscoDuro FromCreate(CreateDiscoDuroDto dto) => new() { TipoDisco = dto.TipoDisco.Trim(), CapacidadGB = dto.CapacidadGB, Descripcion = dto.Descripcion.Trim() };
    protected override void ApplyUpdate(DiscoDuro entity, UpdateDiscoDuroDto dto) { entity.TipoDisco = dto.TipoDisco.Trim(); entity.CapacidadGB = dto.CapacidadGB; entity.Descripcion = dto.Descripcion.Trim(); }
    protected override DiscoDuroResponseDto ToResponse(DiscoDuro entity) => new(entity.IdDiscoDuro, entity.TipoDisco, entity.CapacidadGB, entity.Descripcion);
}

[Route("api/estados-activo")]
public sealed class EstadosActivoController : DtoCrudController<EstadoActivo, CreateEstadoActivoDto, UpdateEstadoActivoDto, EstadoActivoResponseDto>
{
    public EstadosActivoController(AssetManagementDbContext db) : base(db) { }
    protected override EstadoActivo FromCreate(CreateEstadoActivoDto dto) => new() { NombreEstado = dto.NombreEstado.Trim() };
    protected override void ApplyUpdate(EstadoActivo entity, UpdateEstadoActivoDto dto) => entity.NombreEstado = dto.NombreEstado.Trim();
    protected override EstadoActivoResponseDto ToResponse(EstadoActivo entity) => new(entity.IdEstadoActivo, entity.NombreEstado);
}

[Route("api/activo-fijo")]
public sealed class ActivoFijoController : ControllerBase
{
    private readonly AssetManagementDbContext _db;

    public ActivoFijoController(AssetManagementDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ActivoFijoResponseDto>>> GetAll(CancellationToken cancellationToken)
    {
        var activos = await ActivoQuery().ToListAsync(cancellationToken);
        return Ok(activos.Select(ToResponse).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ActivoFijoResponseDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var activo = await ActivoQuery().FirstOrDefaultAsync(x => x.IdActivoFijo == id, cancellationToken);
        return activo is null ? NotFound() : Ok(ToResponse(activo));
    }

    [HttpPost]
    public async Task<ActionResult<ActivoFijoResponseDto>> Create([FromBody] CreateActivoFijoDto dto, CancellationToken cancellationToken)
    {
        var validationError = await ValidateActivoAsync(dto, null, cancellationToken);
        if (validationError is not null)
        {
            return validationError;
        }

        var activo = new ActivoFijo
        {
            IdDimension = dto.IdDimension,
            IdUsuario = dto.IdUsuario,
            RAM = dto.RAM,
            IdMarca = dto.IdMarca,
            IdModelo = dto.IdModelo,
            IdProcesador = dto.IdProcesador,
            IdDiscoDuro = dto.IdDiscoDuro,
            Serial = dto.Serial.Trim(),
            NumeroFactura = NormalizeRequired(dto.NumeroFactura),
            RutProveedor = NormalizeRequired(dto.RutProveedor),
            FechaCompra = dto.FechaCompra ?? DateTime.UtcNow.Date,
            Detalles = Normalize(dto.Detalles),
            EsAF = true,
            IdEstadoActivo = dto.IdEstadoActivo
        };

        _db.ActivosFijos.Add(activo);
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(ToResponse(await LoadActivoAsync(activo.IdActivoFijo, cancellationToken)));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ActivoFijoResponseDto>> Update(int id, [FromBody] UpdateActivoFijoDto dto, CancellationToken cancellationToken)
    {
        var current = await _db.ActivosFijos.FirstOrDefaultAsync(x => x.IdActivoFijo == id, cancellationToken);
        if (current is null)
        {
            return NotFound();
        }

        var validationError = await ValidateActivoAsync(dto, id, cancellationToken);
        if (validationError is not null)
        {
            return validationError;
        }

        var previousIdDimension = current.IdDimension;
        var previousIdUsuario = current.IdUsuario;

        await using var transaction = await _db.Database.BeginTransactionAsync(cancellationToken);

        current.IdDimension = dto.IdDimension;
        current.IdUsuario = dto.IdUsuario;
        current.RAM = dto.RAM;
        current.IdMarca = dto.IdMarca;
        current.IdModelo = dto.IdModelo;
        current.IdProcesador = dto.IdProcesador;
        current.IdDiscoDuro = dto.IdDiscoDuro;
        current.Serial = dto.Serial.Trim();
        current.NumeroFactura = NormalizeRequired(dto.NumeroFactura);
        current.RutProveedor = NormalizeRequired(dto.RutProveedor);
        current.FechaCompra = dto.FechaCompra ?? current.FechaCompra;
        current.Detalles = Normalize(dto.Detalles);
        current.EsAF = true;
        current.IdEstadoActivo = dto.IdEstadoActivo;

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

        return Ok(ToResponse(await LoadActivoAsync(current.IdActivoFijo, cancellationToken)));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var activo = await _db.ActivosFijos.FindAsync([id], cancellationToken);
        if (activo is null)
        {
            return NotFound();
        }

        _db.ActivosFijos.Remove(activo);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("serial/{serial}")]
    public async Task<ActionResult<ActivoFijoResponseDto>> GetBySerial(string serial, CancellationToken cancellationToken)
    {
        var activo = await ActivoQuery().FirstOrDefaultAsync(x => x.Serial == serial, cancellationToken);
        return activo is null ? NotFound() : Ok(ToResponse(activo));
    }

    [HttpGet("dimension/{idDimension:int}")]
    public async Task<ActionResult<IReadOnlyList<ActivoFijoResponseDto>>> GetByDimension(int idDimension, CancellationToken cancellationToken)
    {
        var activos = await ActivoQuery().Where(x => x.IdDimension == idDimension).ToListAsync(cancellationToken);
        return Ok(activos.Select(ToResponse).ToList());
    }

    [HttpGet("usuario/{idUsuario:int}")]
    public async Task<ActionResult<IReadOnlyList<ActivoFijoResponseDto>>> GetByUsuario(int idUsuario, CancellationToken cancellationToken)
    {
        var activos = await ActivoQuery().Where(x => x.IdUsuario == idUsuario).ToListAsync(cancellationToken);
        return Ok(activos.Select(ToResponse).ToList());
    }

    [HttpGet("estado/{idEstadoActivo:int}")]
    public async Task<ActionResult<IReadOnlyList<ActivoFijoResponseDto>>> GetByEstado(int idEstadoActivo, CancellationToken cancellationToken)
    {
        var activos = await ActivoQuery().Where(x => x.IdEstadoActivo == idEstadoActivo).ToListAsync(cancellationToken);
        return Ok(activos.Select(ToResponse).ToList());
    }

    private IQueryable<ActivoFijo> ActivoQuery()
    {
        return _db.ActivosFijos.AsNoTracking()
            .Include(x => x.Dimension)
            .Include(x => x.Usuario)
            .Include(x => x.Marca)
            .Include(x => x.Modelo)
            .Include(x => x.Procesador)
            .Include(x => x.DiscoDuro)
            .Include(x => x.EstadoActivo);
    }

    private async Task<ActivoFijo> LoadActivoAsync(int idActivoFijo, CancellationToken cancellationToken)
    {
        return await ActivoQuery().FirstAsync(x => x.IdActivoFijo == idActivoFijo, cancellationToken);
    }

    private async Task<ActionResult?> ValidateActivoAsync(CreateActivoFijoDto dto, int? currentId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Serial))
        {
            return BadRequest("Serial es obligatorio.");
        }

        if (!await _db.Dimensiones.AnyAsync(x => x.IdDimension == dto.IdDimension, cancellationToken))
        {
            return BadRequest("IdDimension no existe.");
        }

        if (dto.IdUsuario is not null && !await _db.Usuarios.AnyAsync(x => x.IdUsuario == dto.IdUsuario, cancellationToken))
        {
            return BadRequest("IdUsuario no existe.");
        }

        if (!await _db.Marcas.AnyAsync(x => x.IdMarca == dto.IdMarca, cancellationToken))
        {
            return BadRequest("IdMarca no existe.");
        }

        var modelo = await _db.Modelos.AsNoTracking().FirstOrDefaultAsync(x => x.IdModelo == dto.IdModelo, cancellationToken);
        if (modelo is null)
        {
            return BadRequest("IdModelo no existe.");
        }

        if (modelo.IdMarca != dto.IdMarca)
        {
            return BadRequest("IdModelo no pertenece a IdMarca.");
        }

        if (dto.IdProcesador is not null && !await _db.Procesadores.AnyAsync(x => x.IdProcesador == dto.IdProcesador, cancellationToken))
        {
            return BadRequest("IdProcesador no existe.");
        }

        if (dto.IdDiscoDuro is not null && !await _db.DiscosDuros.AnyAsync(x => x.IdDiscoDuro == dto.IdDiscoDuro, cancellationToken))
        {
            return BadRequest("IdDiscoDuro no existe.");
        }

        if (!await _db.EstadosActivo.AnyAsync(x => x.IdEstadoActivo == dto.IdEstadoActivo, cancellationToken))
        {
            return BadRequest("IdEstadoActivo no existe.");
        }

        var normalizedSerial = dto.Serial.Trim();
        var serialExists = await _db.ActivosFijos.AnyAsync(
            x => x.Serial == normalizedSerial && (currentId == null || x.IdActivoFijo != currentId),
            cancellationToken);
        if (serialExists)
        {
            return BadRequest("Ya existe un activo fijo registrado con este serial.");
        }

        return null;
    }

    private async Task<ActionResult?> ValidateActivoAsync(UpdateActivoFijoDto dto, int currentId, CancellationToken cancellationToken)
    {
        var createEquivalent = new CreateActivoFijoDto
        {
            IdDimension = dto.IdDimension,
            IdUsuario = dto.IdUsuario,
            RAM = dto.RAM,
            IdMarca = dto.IdMarca,
            IdModelo = dto.IdModelo,
            IdProcesador = dto.IdProcesador,
            IdDiscoDuro = dto.IdDiscoDuro,
            Serial = dto.Serial,
            NumeroFactura = dto.NumeroFactura,
            RutProveedor = dto.RutProveedor,
            FechaCompra = dto.FechaCompra,
            Detalles = dto.Detalles,
            IdEstadoActivo = dto.IdEstadoActivo
        };
        return await ValidateActivoAsync(createEquivalent, currentId, cancellationToken);
    }

    private static ActivoFijoResponseDto ToResponse(ActivoFijo entity)
    {
        return new ActivoFijoResponseDto(
            entity.IdActivoFijo,
            entity.IdDimension,
            entity.Dimension?.NombreDimension,
            entity.IdUsuario,
            entity.Usuario is null ? null : $"{entity.Usuario.NombreUsuario} {entity.Usuario.ApellidoPaterno}".Trim(),
            entity.RAM,
            entity.IdMarca,
            entity.Marca?.NombreMarca,
            entity.IdModelo,
            entity.Modelo?.NombreModelo,
            entity.IdProcesador,
            entity.Procesador?.NombreProcesador,
            entity.IdDiscoDuro,
            entity.DiscoDuro?.TipoDisco,
            entity.DiscoDuro?.CapacidadGB,
            entity.Serial,
            entity.NumeroFactura,
            entity.RutProveedor,
            entity.FechaCompra,
            entity.Detalles,
            entity.EsAF,
            entity.IdEstadoActivo,
            entity.EstadoActivo?.NombreEstado);
    }

    private static string NormalizeRequired(string? value) => string.IsNullOrWhiteSpace(value) ? string.Empty : value.Trim();
    private static string? Normalize(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}

[Route("api/movimientos-activo-fijo")]
public sealed class MovimientosActivoFijoController : DtoCrudController<MovimientoActivoFijo, CreateMovimientoActivoFijoDto, UpdateMovimientoActivoFijoDto, MovimientoActivoFijoResponseDto>
{
    public MovimientosActivoFijoController(AssetManagementDbContext db) : base(db) { }

    [HttpGet("activo/{idActivoFijo:int}")]
    public async Task<ActionResult<IReadOnlyList<MovimientoActivoFijoResponseDto>>> GetByActivo(int idActivoFijo, CancellationToken cancellationToken)
    {
        var movimientos = await Db.MovimientosActivoFijo.AsNoTracking()
            .Where(x => x.IdActivoFijo == idActivoFijo)
            .OrderByDescending(x => x.FechaMovimiento)
            .ToListAsync(cancellationToken);

        return Ok(movimientos.Select(ToResponse).ToList());
    }

    protected override async Task<ActionResult?> ValidateCreateAsync(CreateMovimientoActivoFijoDto dto, CancellationToken cancellationToken) => await ValidateActivoAsync(dto.IdActivoFijo, cancellationToken);
    protected override async Task<ActionResult?> ValidateUpdateAsync(int id, UpdateMovimientoActivoFijoDto dto, CancellationToken cancellationToken) => await ValidateActivoAsync(dto.IdActivoFijo, cancellationToken);
    protected override MovimientoActivoFijo FromCreate(CreateMovimientoActivoFijoDto dto) => new() { IdActivoFijo = dto.IdActivoFijo, IdDimensionAnterior = dto.IdDimensionAnterior, IdDimensionNueva = dto.IdDimensionNueva, IdUsuarioAnterior = dto.IdUsuarioAnterior, IdUsuarioNuevo = dto.IdUsuarioNuevo, FechaMovimiento = dto.FechaMovimiento, Observacion = dto.Observacion.Trim() };
    protected override void ApplyUpdate(MovimientoActivoFijo entity, UpdateMovimientoActivoFijoDto dto) { entity.IdActivoFijo = dto.IdActivoFijo; entity.IdDimensionAnterior = dto.IdDimensionAnterior; entity.IdDimensionNueva = dto.IdDimensionNueva; entity.IdUsuarioAnterior = dto.IdUsuarioAnterior; entity.IdUsuarioNuevo = dto.IdUsuarioNuevo; entity.FechaMovimiento = dto.FechaMovimiento; entity.Observacion = dto.Observacion.Trim(); }
    protected override MovimientoActivoFijoResponseDto ToResponse(MovimientoActivoFijo entity) => new(entity.IdMovimiento, entity.IdActivoFijo, entity.IdDimensionAnterior, entity.IdDimensionNueva, entity.IdUsuarioAnterior, entity.IdUsuarioNuevo, entity.FechaMovimiento, entity.Observacion);

    private async Task<ActionResult?> ValidateActivoAsync(int idActivoFijo, CancellationToken cancellationToken) => await Db.ActivosFijos.AnyAsync(x => x.IdActivoFijo == idActivoFijo, cancellationToken) ? null : BadRequest("IdActivoFijo no existe.");
}

[Route("api/checklist")]
public sealed class ChecklistController : DtoCrudController<Checklist, CreateChecklistDto, UpdateChecklistDto, ChecklistResponseDto>
{
    private readonly IWebHostEnvironment _environment;

    public ChecklistController(AssetManagementDbContext db, IWebHostEnvironment environment) : base(db)
    {
        _environment = environment;
    }

    [HttpGet("{id:int}/download")]
    public async Task<IActionResult> Download(int id, CancellationToken cancellationToken)
    {
        var checklist = await Db.Checklists.AsNoTracking().FirstOrDefaultAsync(x => x.IdChecklist == id, cancellationToken);
        if (checklist is null)
        {
            return NotFound();
        }

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

    protected override Checklist FromCreate(CreateChecklistDto dto) => new() { NombreChecklist = dto.NombreChecklist.Trim(), TipoChecklist = NormalizeRequired(dto.TipoChecklist), NombreArchivo = dto.NombreArchivo.Trim(), RutaArchivo = dto.RutaArchivo.Trim(), ExtensionArchivo = dto.ExtensionArchivo.Trim(), FechaCreacion = DateTime.UtcNow };
    protected override void ApplyUpdate(Checklist entity, UpdateChecklistDto dto) { entity.NombreChecklist = dto.NombreChecklist.Trim(); entity.TipoChecklist = NormalizeRequired(dto.TipoChecklist); entity.NombreArchivo = dto.NombreArchivo.Trim(); entity.RutaArchivo = dto.RutaArchivo.Trim(); entity.ExtensionArchivo = dto.ExtensionArchivo.Trim(); }
    protected override ChecklistResponseDto ToResponse(Checklist entity) => new(entity.IdChecklist, entity.NombreChecklist, entity.TipoChecklist, entity.NombreArchivo, entity.RutaArchivo, entity.ExtensionArchivo, entity.FechaCreacion);
    private static string NormalizeRequired(string? value) => string.IsNullOrWhiteSpace(value) ? string.Empty : value.Trim();
}

[Route("api/herramientas")]
public sealed class HerramientasController : DtoCrudController<Herramienta, CreateHerramientaDto, UpdateHerramientaDto, HerramientaResponseDto>
{
    public HerramientasController(AssetManagementDbContext db) : base(db) { }

    public override async Task<ActionResult<IReadOnlyList<HerramientaResponseDto>>> GetAll(CancellationToken cancellationToken)
    {
        var herramientas = await HerramientasQuery().ToListAsync(cancellationToken);
        return Ok(herramientas.Select(ToResponse).ToList());
    }

    public override async Task<ActionResult<HerramientaResponseDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var herramienta = await HerramientasQuery().FirstOrDefaultAsync(x => x.IdHerramienta == id, cancellationToken);
        return herramienta is null ? NotFound() : Ok(ToResponse(herramienta));
    }

    [HttpGet("dimension/{idDimension:int}")]
    public async Task<ActionResult<IReadOnlyList<HerramientaResponseDto>>> GetByDimension(int idDimension, CancellationToken cancellationToken)
    {
        var herramientas = await HerramientasQuery().Where(x => x.IdDimension == idDimension).ToListAsync(cancellationToken);
        return Ok(herramientas.Select(ToResponse).ToList());
    }

    [HttpGet("estado/{estado}")]
    public async Task<ActionResult<IReadOnlyList<HerramientaResponseDto>>> GetByEstado(string estado, CancellationToken cancellationToken)
    {
        var herramientas = await HerramientasQuery().Where(x => x.Estado == estado).ToListAsync(cancellationToken);
        return Ok(herramientas.Select(ToResponse).ToList());
    }

    protected override async Task<ActionResult?> ValidateCreateAsync(CreateHerramientaDto dto, CancellationToken cancellationToken) => await ValidateDimensionAsync(dto.IdDimension, cancellationToken);
    protected override async Task<ActionResult?> ValidateUpdateAsync(int id, UpdateHerramientaDto dto, CancellationToken cancellationToken) => await ValidateDimensionAsync(dto.IdDimension, cancellationToken);
    protected override Herramienta FromCreate(CreateHerramientaDto dto) => new() { NombreHerramienta = dto.NombreHerramienta.Trim(), TipoHerramienta = NormalizeRequired(dto.TipoHerramienta), Marca = Normalize(dto.Marca), Modelo = Normalize(dto.Modelo), Serial = Normalize(dto.Serial), Cantidad = dto.Cantidad, IdDimension = dto.IdDimension, Estado = NormalizeRequired(dto.Estado), Detalles = Normalize(dto.Detalles), FechaRegistro = DateTime.UtcNow, Activo = true };
    protected override void ApplyUpdate(Herramienta entity, UpdateHerramientaDto dto) { entity.NombreHerramienta = dto.NombreHerramienta.Trim(); entity.TipoHerramienta = NormalizeRequired(dto.TipoHerramienta); entity.Marca = Normalize(dto.Marca); entity.Modelo = Normalize(dto.Modelo); entity.Serial = Normalize(dto.Serial); entity.Cantidad = dto.Cantidad; entity.IdDimension = dto.IdDimension; entity.Estado = NormalizeRequired(dto.Estado); entity.Detalles = Normalize(dto.Detalles); entity.Activo = dto.Activo; }
    protected override HerramientaResponseDto ToResponse(Herramienta entity) => new(entity.IdHerramienta, entity.NombreHerramienta, entity.TipoHerramienta, entity.Marca, entity.Modelo, entity.Serial, entity.Cantidad, entity.IdDimension, entity.Dimension?.NombreDimension, entity.Estado, entity.Detalles, entity.FechaRegistro, entity.Activo);

    private IQueryable<Herramienta> HerramientasQuery() => Db.Herramientas.AsNoTracking().Include(x => x.Dimension);
    private async Task<ActionResult?> ValidateDimensionAsync(int? idDimension, CancellationToken cancellationToken) => idDimension is null || await Db.Dimensiones.AnyAsync(x => x.IdDimension == idDimension, cancellationToken) ? null : BadRequest("IdDimension no existe.");
    private static string NormalizeRequired(string? value) => string.IsNullOrWhiteSpace(value) ? string.Empty : value.Trim();
    private static string? Normalize(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
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
        var disponible = await _db.EstadosActivo.AsNoTracking()
            .Where(x => x.NombreEstado == "Disponible")
            .Select(x => x.IdEstadoActivo)
            .FirstOrDefaultAsync(cancellationToken);

        return Ok(new DashboardSummaryDto(
            await _db.ActivosFijos.CountAsync(cancellationToken),
            await _db.ActivosFijos.CountAsync(x => x.IdEstadoActivo == disponible, cancellationToken),
            await _db.Usuarios.CountAsync(x => x.Activo, cancellationToken),
            await _db.Herramientas.CountAsync(x => x.Activo, cancellationToken),
            await _db.MovimientosActivoFijo.CountAsync(cancellationToken),
            await _db.Checklists.CountAsync(cancellationToken)));
    }
}
