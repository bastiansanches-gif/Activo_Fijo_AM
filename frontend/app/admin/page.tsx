import { Settings } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <RoleGuard roles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Configuracion</h2>
          <p className="text-muted-foreground">Parametros generales de la plataforma.</p>
        </div>
        <Card>
          <CardHeader><CardTitle>Preferencias del sistema</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {["Integracion SAP", "Auditoria", "Notificaciones"].map((item) => (
              <div key={item} className="rounded-2xl border bg-background p-5">
                <Settings className="mb-4 h-5 w-5 text-muted-foreground" />
                <p className="font-medium">{item}</p>
                <p className="text-sm text-muted-foreground">Mock preparado para configuracion futura.</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
