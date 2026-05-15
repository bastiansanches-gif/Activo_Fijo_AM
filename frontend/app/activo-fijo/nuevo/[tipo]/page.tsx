"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ActivoFijoForm } from "@/components/activo-fijo/ActivoFijoForm";
import { assetTypes } from "@/components/activo-fijo/AssetTypeCards";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Button } from "@/components/ui/button";

export default function Page({ params }: { params: { tipo: string } }) {
  const type = assetTypes.find((item) => item.slug === params.tipo);

  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal sm:text-3xl">Nuevo activo{type ? `: ${type.name}` : ""}</h2>
            <p className="text-sm text-muted-foreground sm:text-base">Completa asignacion, dimension y datos del activo.</p>
          </div>
          <Button asChild variant="outline" className="h-11 w-full justify-center sm:w-auto">
            <Link href="/activo-fijo/nuevo">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>
        <ActivoFijoForm tipo={params.tipo} />
      </div>
    </RoleGuard>
  );
}
