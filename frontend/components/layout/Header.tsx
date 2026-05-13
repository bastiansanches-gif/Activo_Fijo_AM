"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth-service";
import type { UsuarioSistema } from "@/types/auth";

type HeaderProps = {
  onMenuClick?: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState<UsuarioSistema | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    setUser(authService.getSession());
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button className="lg:hidden" variant="ghost" size="icon" onClick={onMenuClick} aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <p className="text-xs uppercase text-muted-foreground">Gestion TI</p>
            <h1 className="truncate text-base font-semibold">Activos fijos corporativos</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDark((value) => !value)} aria-label="Cambiar tema">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user?.nomUsuario}</p>
            <p className="text-xs text-muted-foreground">{user?.tipoUsuario}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              authService.logout();
              router.push("/login");
            }}
            aria-label="Cerrar sesion"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
