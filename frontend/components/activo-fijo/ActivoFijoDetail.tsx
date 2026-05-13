"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { movimientosService } from "@/services/movimientos-service";
import type { ActivoFijo } from "@/types/activo-fijo";

export function ActivoFijoDetail({ activo }: { activo: ActivoFijo }) {
  const movimientos = useQuery({
    queryKey: ["movimientos-activo", activo.idActivoFijo],
    queryFn: () => movimientosService.byActivo(activo.idActivoFijo ?? 0),
    enabled: Boolean(activo.idActivoFijo),
  });

  const rows = [
    ["Serie", activo.serial],
    ["Marca", activo.marca ?? String(activo.idMarca)],
    ["Modelo", activo.modelo ?? String(activo.idModelo)],
    ["Procesador", activo.procesador ?? (activo.idProcesador ? String(activo.idProcesador) : "No aplica")],
    ["Disco duro", activo.discoDuro ?? (activo.idDiscoDuro ? String(activo.idDiscoDuro) : "No aplica")],
    ["RAM", activo.ram ? `${activo.ram} GB` : "No aplica"],
    ["Dimension", activo.dimension ?? String(activo.idDimension)],
    ["Usuario", activo.usuario ?? (activo.idUsuario ? String(activo.idUsuario) : "Sin asignar")],
    ["Factura", activo.numeroFactura],
    ["Rut proveedor", activo.rutProveedor],
    ["Fecha compra", activo.fechaCompra],
  ];

  return (
    <Tabs defaultValue="detalle" className="space-y-4">
      <TabsList>
        <TabsTrigger value="detalle">Detalle</TabsTrigger>
        <TabsTrigger value="historial">Historial de movimientos</TabsTrigger>
      </TabsList>
      <TabsContent value="detalle">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>{activo.serial}</CardTitle>
              <Badge variant="secondary">{activo.estadoActivo}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label} className="rounded-2xl border bg-background p-4">
                <p className="text-xs uppercase text-muted-foreground">{label}</p>
                <p className="mt-1 font-medium">{value}</p>
              </div>
            ))}
            <div className="rounded-2xl border bg-background p-4 md:col-span-2">
              <p className="text-xs uppercase text-muted-foreground">Detalles</p>
              <p className="mt-1 text-sm">{activo.detalles}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="historial">
        <Card>
          <CardHeader>
            <CardTitle>Historial de movimientos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {movimientos.isLoading && <p className="text-sm text-muted-foreground">Cargando historial...</p>}
            {movimientos.error && <p className="text-sm text-destructive">No se pudo cargar el historial.</p>}
            {!movimientos.isLoading && !movimientos.data?.length && <p className="text-sm text-muted-foreground">Sin movimientos registrados para este activo.</p>}
            {movimientos.data?.map((movimiento) => (
              <div key={movimiento.idMovimiento ?? movimiento.IdMovimiento} className="rounded-2xl border bg-background p-4">
                <p className="font-medium">{movimiento.observacion ?? movimiento.Observacion ?? "Movimiento de asignacion"}</p>
                <p className="text-sm text-muted-foreground">
                  Dimension {movimiento.idDimensionAnterior ?? movimiento.IdDimensionAnterior} {"->"} {movimiento.idDimensionNueva ?? movimiento.IdDimensionNueva}
                </p>
                <p className="text-xs text-muted-foreground">{movimiento.fechaMovimiento ?? movimiento.FechaMovimiento}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
