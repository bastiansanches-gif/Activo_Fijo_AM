import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivoFijo } from "@/types/activo-fijo";

export function ActivoFijoDetail({ activo }: { activo: ActivoFijo }) {
  const rows = [
    ["Serie", activo.serieActivo],
    ["SKU", activo.sku],
    ["Codigo SAP", activo.codSAP],
    ["Categoria", activo.categoriaActivo],
    ["Marca", activo.marca],
    ["Modelo", activo.modelo],
    ["CentroCosto", activo.codCC],
    ["Canal", activo.codCanal],
    ["Tienda", activo.idTienda],
    ["Factura", activo.numeroFactura],
    ["Proveedor", activo.proveedorNombre],
    ["Precio", `$${activo.precioCompra.toLocaleString("es-CL")}`],
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>{activo.nomActivo}</CardTitle>
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
  );
}
