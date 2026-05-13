import { apiClient } from "./apiClient";

export type MovimientoActivo = {
  idMovimiento?: number;
  IdMovimiento?: number;
  idActivoFijo?: number;
  IdActivoFijo?: number;
  idDimensionAnterior?: number;
  IdDimensionAnterior?: number;
  idDimensionNueva?: number;
  IdDimensionNueva?: number;
  idUsuarioAnterior?: number | null;
  IdUsuarioAnterior?: number | null;
  idUsuarioNuevo?: number | null;
  IdUsuarioNuevo?: number | null;
  fechaMovimiento?: string;
  FechaMovimiento?: string;
  observacion?: string | null;
  Observacion?: string | null;
};

export const movimientosService = {
  byActivo: (idActivoFijo: number) => apiClient<MovimientoActivo[]>(`/movimientos-activo-fijo/activo/${idActivoFijo}`),
};
