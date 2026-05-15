"use client";

import Link from "next/link";
import { AlertTriangle, Boxes, ClipboardCheck, Download, FileWarning, Hammer, Plus, Store, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BentoCard } from "@/components/bento/BentoCard";
import { StatsCard } from "@/components/bento/StatsCard";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardService } from "@/services/dashboardService";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["dashboard-summary"], queryFn: dashboardService.summary });

  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Dashboard</h2>
          <p className="text-muted-foreground">Vista ejecutiva de activos fijos TI.</p>
        </div>
        <Link
          href="/activo-fijo/nuevo"
          className="flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-[#0057B8] p-5 text-white shadow-soft transition hover:bg-[#004A9E]"
        >
          <span>
            <span className="block text-lg font-semibold">Agregar activo fijo</span>
            <span className="mt-1 block text-sm text-white/80">Selecciona el tipo de activo y completa el ingreso.</span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Plus className="h-5 w-5" />
          </span>
        </Link>
        {isLoading && <p className="text-sm text-muted-foreground">Cargando resumen real...</p>}
        {error && <p className="text-sm text-destructive">No se pudo conectar con el resumen del backend.</p>}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total activos" value={data?.activosTotales ?? 0} detail="Inventario TI registrado" icon={Boxes} className="border-blue-100 bg-[#D9ECFF] text-[#003B7A]" iconClassName="text-[#0057B8]" />
          <StatsCard title="Disponibles" value={data?.activosDisponibles ?? 0} detail="Listos para asignacion" icon={ClipboardCheck} className="border-emerald-100 bg-[#DDF8E8] text-[#14532D]" iconClassName="text-[#157347]" />
          <StatsCard title="Usuarios activos" value={data?.usuariosActivos ?? 0} detail="Colaboradores vigentes" icon={Store} className="border-violet-100 bg-[#ECE2FF] text-[#44228A]" iconClassName="text-[#6D3FD1]" />
          <StatsCard title="Herramientas" value={data?.herramientasActivas ?? 0} detail="Inventario operacional" icon={AlertTriangle} className="border-amber-100 bg-[#FFF4C7] text-[#6F4D00]" iconClassName="text-[#9A6A00]" />
        </section>
        <section className="grid gap-3 md:grid-cols-4">
          <Button asChild variant="outline" className="h-12 justify-center">
            <Link href="/activo-fijo"><Boxes className="h-4 w-4" /> Ver activos</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 justify-center">
            <Link href="/herramientas"><Hammer className="h-4 w-4" /> Ver herramientas</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 justify-center">
            <Link href="/usuarios"><Users className="h-4 w-4" /> Ver usuarios</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 justify-center">
            <Link href="/checklist"><Download className="h-4 w-4" /> Descargar checklist</Link>
          </Button>
        </section>
        <section className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <BentoCard className="bg-primary text-primary-foreground">
            <CardHeader><CardTitle>Inconsistencias SAP</CardTitle></CardHeader>
            <CardContent>
              <p className="text-5xl font-semibold">{data?.checklists ?? 0}</p>
              <p className="mt-2 text-sm opacity-75">Plantillas listas para entrega, devolucion y toma de activo.</p>
              <FileWarning className="mt-8 h-16 w-16 opacity-20" />
            </CardContent>
          </BentoCard>
          <BentoCard>
            <CardHeader><CardTitle>Ultimos movimientos</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border bg-background p-4">
                <p className="font-medium">{data?.movimientosRegistrados ?? 0} movimientos registrados</p>
                <p className="text-sm text-muted-foreground">Se generan automaticamente al cambiar usuario o dimension.</p>
              </div>
            </CardContent>
          </BentoCard>
        </section>
      </div>
    </RoleGuard>
  );
}
