"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, ClipboardCheck, Hammer, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth-service";
import { cn } from "@/lib/utils";
import type { TipoUsuario, UsuarioSistema } from "@/types/auth";

const items: Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }>; roles: TipoUsuario[] }> = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3, roles: ["ADMIN", "NORMAL"] },
  { href: "/activo-fijo", label: "Activo Fijo", icon: Boxes, roles: ["ADMIN", "NORMAL"] },
  { href: "/herramientas", label: "Herramientas", icon: Hammer, roles: ["ADMIN", "NORMAL"] },
  { href: "/usuarios", label: "Usuarios", icon: Users, roles: ["ADMIN", "NORMAL"] },
  { href: "/checklist", label: "Checklist", icon: ClipboardCheck, roles: ["ADMIN", "NORMAL"] },
  { href: "/configuracion", label: "Configuracion", icon: Settings, roles: ["ADMIN", "NORMAL"] },
] as const;

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<UsuarioSistema | null>(null);

  useEffect(() => {
    setUser(authService.getSession());
  }, [pathname]);

  const visibleItems = items.filter((item) => user && item.roles.includes(user.tipoUsuario));

  return (
    <aside className={cn("fixed inset-y-0 left-0 z-40 w-72 border-r border-blue-900/20 bg-[#003B7A] px-4 py-5 text-white shadow-2xl", className)}>
      <div className="mb-8 rounded-2xl bg-white/10 p-4 text-white shadow-[0_0_35px_rgba(77,163,255,0.25)]">
        <Image src="/logos/logo-audiomusica-wh.svg" alt="Audiomusica" width={150} height={32} className="mb-3 h-8 w-auto" />
        <p className="text-xs uppercase opacity-70">Audiomusica</p>
        <strong className="block text-lg">Asset Management</strong>
      </div>
      <nav className="space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
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

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
