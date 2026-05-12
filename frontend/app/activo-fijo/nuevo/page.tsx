import { ActivoFijoForm } from "@/components/activo-fijo/ActivoFijoForm";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function NuevoActivoPage() {
  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Nuevo activo</h2>
          <p className="text-muted-foreground">Formulario preparado para integracion posterior con API .NET 8.</p>
        </div>
        <ActivoFijoForm />
      </div>
    </RoleGuard>
  );
}
