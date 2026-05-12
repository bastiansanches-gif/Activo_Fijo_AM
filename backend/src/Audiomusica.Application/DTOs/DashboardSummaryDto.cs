namespace Audiomusica.Application.DTOs;

public sealed record DashboardSummaryDto(
    int ActivosTotales,
    int ActivosDisponibles,
    int UsuariosActivos,
    int HerramientasActivas,
    int MovimientosRegistrados,
    int Checklists);
