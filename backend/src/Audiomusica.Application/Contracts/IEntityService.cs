namespace Audiomusica.Application.Contracts;

public interface IEntityService<TEntity> where TEntity : class
{
    Task<IReadOnlyList<TEntity>> GetAllAsync(CancellationToken cancellationToken);
    Task<TEntity?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<TEntity> CreateAsync(TEntity entity, CancellationToken cancellationToken);
    Task<TEntity?> UpdateAsync(int id, TEntity entity, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
}
