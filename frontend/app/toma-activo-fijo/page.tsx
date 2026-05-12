import { ClipboardCheck } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TomaActivoFijoPage() {
  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Toma de Activo Fijo</h2>
          <p className="text-muted-foreground">Control mock de levantamientos fisicos por tienda o centro de costo.</p>
        </div>
        <Card>
          <CardHeader><CardTitle>Jornada de inventario</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {["Pendientes", "Escaneados", "Diferencias"].map((item, index) => (
              <div key={item} className="rounded-2xl border bg-background p-5">
                <ClipboardCheck className="mb-4 h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{item}</p>
                <p className="text-3xl font-semibold">{[42, 186, 5][index]}</p>
              </div>
            ))}
            <Button className="md:col-span-3">Iniciar toma mock</Button>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
