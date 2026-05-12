using Audiomusica.Application.Contracts;
using Audiomusica.Domain.Entities;
using Audiomusica.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Audiomusica.Infrastructure.Services;

public class EntityService<TEntity> : IEntityService<TEntity> where TEntity : class
{
    private readonly AssetManagementDbContext _db;

    public EntityService(AssetManagementDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<TEntity>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _db.Set<TEntity>().AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<TEntity?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _db.Set<TEntity>().FindAsync([id], cancellationToken);
    }

    public async Task<TEntity> CreateAsync(TEntity entity, CancellationToken cancellationToken)
    {
        SetDefaultDates(entity);
        _db.Set<TEntity>().Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<TEntity?> UpdateAsync(int id, TEntity entity, CancellationToken cancellationToken)
    {
        var current = await _db.Set<TEntity>().FindAsync([id], cancellationToken);
        if (current is null)
        {
            return null;
        }

        if (current is ActivoFijo currentAsset && entity is ActivoFijo newAsset)
        {
            await UpdateActivoFijoWithMovementAsync(currentAsset, newAsset, cancellationToken);
            return current;
        }

        _db.Entry(current).CurrentValues.SetValues(entity);
        SetPrimaryKey(current, id);
        await _db.SaveChangesAsync(cancellationToken);
        return current;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await _db.Set<TEntity>().FindAsync([id], cancellationToken);
        if (entity is null)
        {
            return false;
        }

        if (entity is IHasActivo softDelete)
        {
            softDelete.Activo = false;
        }
        else
        {
            _db.Set<TEntity>().Remove(entity);
        }

        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task UpdateActivoFijoWithMovementAsync(ActivoFijo current, ActivoFijo updated, CancellationToken cancellationToken)
    {
        var dimensionAnterior = current.IdDimension;
        var usuarioAnterior = current.IdUsuario;
        var changedAssignment = dimensionAnterior != updated.IdDimension || usuarioAnterior != updated.IdUsuario;

        _db.Entry(current).CurrentValues.SetValues(updated);
        current.IdActivoFijo = updated.IdActivoFijo == 0 ? current.IdActivoFijo : updated.IdActivoFijo;

        if (changedAssignment)
        {
            // La trazabilidad de movimientos se genera en backend para no depender de la UI.
            _db.MovimientosActivoFijo.Add(new MovimientoActivoFijo
            {
                IdActivoFijo = current.IdActivoFijo,
                IdDimensionAnterior = dimensionAnterior,
                IdDimensionNueva = current.IdDimension,
                IdUsuarioAnterior = usuarioAnterior,
                IdUsuarioNuevo = current.IdUsuario,
                FechaMovimiento = DateTime.Now,
                Observacion = "Cambio automatico generado por actualizacion de activo fijo"
            });
        }

        await _db.SaveChangesAsync(cancellationToken);
    }

    private void SetPrimaryKey(TEntity entity, int id)
    {
        var key = _db.Model.FindEntityType(typeof(TEntity))?.FindPrimaryKey()?.Properties.SingleOrDefault();
        if (key?.PropertyInfo is not null)
        {
            key.PropertyInfo.SetValue(entity, id);
        }
    }

    private static void SetDefaultDates(TEntity entity)
    {
        if (entity is Checklist checklist && checklist.FechaCreacion == default)
        {
            checklist.FechaCreacion = DateTime.Now;
        }

        if (entity is Herramienta herramienta && herramienta.FechaRegistro == default)
        {
            herramienta.FechaRegistro = DateTime.Now;
        }
    }
}
