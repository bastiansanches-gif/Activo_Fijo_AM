"use client";

import Link from "next/link";
import {
  BatteryCharging,
  Cpu,
  HardDrive,
  Laptop,
  Monitor,
  MonitorSmartphone,
  Printer,
  Server,
  Smartphone,
  TabletSmartphone,
  Tv,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const assetTypes = [
  { slug: "notebook", name: "Notebook", icon: Laptop, className: "bg-[#D9ECFF] text-[#0057B8]" },
  { slug: "aio", name: "AIO", icon: MonitorSmartphone, className: "bg-[#ECE2FF] text-[#6D3FD1]" },
  { slug: "servidor", name: "Servidor", icon: Server, className: "bg-[#E7EEF7] text-[#34516F]" },
  { slug: "impresora", name: "Impresora", icon: Printer, className: "bg-[#DDF8E8] text-[#157347]" },
  { slug: "disco", name: "Disco", icon: HardDrive, className: "bg-[#D9F7FF] text-[#007C99]" },
  { slug: "chip", name: "Chip", icon: TabletSmartphone, className: "bg-[#FFE1EF] text-[#BC2A6B]" },
  { slug: "monitor", name: "Monitor", icon: Monitor, className: "bg-[#DDEBFF] text-[#0057B8]" },
  { slug: "tv", name: "TV", icon: Tv, className: "bg-[#FFE2D9] text-[#B5472F]" },
  { slug: "periferico", name: "Periferico", icon: Cpu, className: "bg-[#FFF4C7] text-[#9A6A00]" },
  { slug: "cargador", name: "Cargador / Fuente de poder", icon: BatteryCharging, className: "bg-[#FFE5CE] text-[#B85500]" },
  { slug: "celular", name: "Celular", icon: Smartphone, className: "bg-[#E9E1FF] text-[#5E3AC9]" },
  { slug: "usuario", name: "Usuario", icon: UserRound, className: "bg-[#E6F4EA] text-[#1E7E34]" },
] as const;

export type AssetTypeSlug = (typeof assetTypes)[number]["slug"];

export function getAssetTypeName(slug?: string | null) {
  return assetTypes.find((type) => type.slug === slug)?.name ?? "Notebook";
}

export function AssetTypeCards({ selected, compact = false }: { selected?: string | null; compact?: boolean }) {
  return (
    <section className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", compact && "lg:grid-cols-3 xl:grid-cols-6")}>
      {assetTypes.map((type) => {
        const Icon = type.icon;
        const active = selected === type.slug;
        return (
          <Link
            key={type.slug}
            href={`/activo-fijo/nuevo?tipo=${type.slug}`}
            className={cn(
              "group rounded-3xl border border-white/70 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,87,184,0.18)]",
              type.className,
              active && "ring-2 ring-[#0057B8] ring-offset-2",
              compact && "p-4",
            )}
          >
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/75 shadow-sm transition group-hover:scale-105">
              <Icon className="h-6 w-6" />
            </span>
            <span className="block text-base font-semibold leading-tight">{type.name}</span>
          </Link>
        );
      })}
    </section>
  );
}
