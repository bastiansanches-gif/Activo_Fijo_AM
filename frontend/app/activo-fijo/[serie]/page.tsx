"use client";

import { useQuery } from "@tanstack/react-query";
import { ActivoFijoDetail } from "@/components/activo-fijo/ActivoFijoDetail";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Card, CardContent } from "@/components/ui/card";
import { activoFijoService } from "@/services/activo-fijo-service";

export default function ActivoDetallePage({ params }: { params: { serie: string } }) {
  const serie = decodeURIComponent(params.serie);
  const { data, isLoading } = useQuery({ queryKey: ["activo", serie], queryFn: () => activoFijoService.getBySerie(serie) });

  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      {isLoading && (
        <Card>
          <CardContent className="p-6">Cargando activo...</CardContent>
        </Card>
      )}
      {!isLoading && data && <ActivoFijoDetail activo={data} />}
      {!isLoading && !data && (
        <Card>
          <CardContent className="p-6">Activo no encontrado.</CardContent>
        </Card>
      )}
    </RoleGuard>
  );
}
