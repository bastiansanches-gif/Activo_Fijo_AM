"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, Building2, ClipboardCheck, Database, Hammer, History, Settings, Users } from "lucide-react";
import { authService } from "@/services/auth-service";
import { cn } from "@/lib/utils";
import type { TipoUsuario } from "@/types/auth";

const items: Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }>; roles: TipoUsuario[] }> = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3, roles: ["ADMIN"] },
  { href: "/activo-fijo", label: "Activo Fijo", icon: Boxes, roles: ["ADMIN", "NORMAL"] },
  { href: "/herramientas", label: "Herramientas", icon: Hammer, roles: ["ADMIN", "NORMAL"] },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users, roles: ["ADMIN"] },
  { href: "/admin/centro-costo", label: "CentroCosto", icon: Building2, roles: ["ADMIN"] },
  { href: "/admin/maestros", label: "Maestros", icon: Database, roles: ["ADMIN"] },
  { href: "/checklist", label: "Checklist", icon: ClipboardCheck, roles: ["ADMIN", "NORMAL"] },
  { href: "/toma-activo-fijo", label: "Movimientos", icon: History, roles: ["ADMIN"] },
  { href: "/admin", label: "Configuracion", icon: Settings, roles: ["ADMIN"] },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const user = authService.getSession();
  const visibleItems = items.filter((item) => user && item.roles.includes(user.tipoUsuario));

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-blue-900/20 bg-[#003B7A] px-4 py-5 text-white shadow-2xl lg:block">
      <div className="mb-8 rounded-2xl bg-white/10 p-4 text-white shadow-[0_0_35px_rgba(77,163,255,0.25)]">
        <img src="/logos/logo-audiomusica.svg" alt="Audiomusica" className="mb-3 h-8 w-auto" />
        <p className="text-xs uppercase opacity-70">Audiomusica</p>
        <strong className="block text-lg">Asset Management</strong>
      </div>
      <nav className="space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white",
                active && "bg-[#0057B8] text-white shadow-[0_0_24px_rgba(77,163,255,0.35)]",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-5 left-4 right-4 rounded-2xl border border-white/10 bg-white/10 p-4">
        <p className="text-xs text-white/60">Sesion</p>
        <p className="truncate text-sm font-semibold">{user?.nomUsuario ?? "No autenticado"}</p>
        <p className="text-xs text-white/60">{user?.tipoUsuario}</p>
      </div>
    </aside>
  );
}
