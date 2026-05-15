"use client";

import { AssetTypeCards } from "@/components/activo-fijo/AssetTypeCards";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function ActivoFijoCreatePage() {
  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Nuevo activo</h2>
          <p className="text-muted-foreground">Paso 1: selecciona el tipo de activo para abrir el formulario dedicado.</p>
        </div>
        <AssetTypeCards compact />
      </div>
    </RoleGuard>
  );
}
