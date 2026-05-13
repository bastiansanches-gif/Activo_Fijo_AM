"use client";

import { useQuery } from "@tanstack/react-query";
import { ActivoFijoTable } from "@/components/activo-fijo/ActivoFijoTable";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { activoFijoService } from "@/services/activo-fijo-service";

export default function ActivoFijoPage() {
  const { data = [], isLoading, error } = useQuery({ queryKey: ["activos"], queryFn: activoFijoService.list });

  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-normal">Activo Fijo</h2>
            <p className="text-muted-foreground">Consulta, busqueda, filtros, detalle e historial de activos ingresados.</p>
          </div>
        </div>
        {isLoading && <p className="text-sm text-muted-foreground">Cargando activos desde backend...</p>}
        {error && <p className="text-sm text-destructive">No se pudo conectar con el backend de activo fijo.</p>}
        <ActivoFijoTable activos={data} />
      </div>
    </RoleGuard>
  );
}
