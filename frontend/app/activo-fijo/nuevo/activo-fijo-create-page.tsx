"use client";

import { ActivoFijoForm } from "@/components/activo-fijo/ActivoFijoForm";
import { AssetTypeCards } from "@/components/activo-fijo/AssetTypeCards";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function ActivoFijoCreatePage({ selectedType }: { selectedType?: string | null }) {
  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Nuevo activo</h2>
          <p className="text-muted-foreground">Paso 1: selecciona el tipo de activo y completa el flujo operacional.</p>
        </div>
        <AssetTypeCards selected={selectedType} compact />
        <ActivoFijoForm />
      </div>
    </RoleGuard>
  );
}
