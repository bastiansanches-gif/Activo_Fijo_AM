"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { TipoUsuario, UsuarioSistema } from "@/types/auth";
import { authService } from "@/services/auth-service";
import { Card, CardContent } from "@/components/ui/card";

export function RoleGuard({ roles, children }: { roles?: TipoUsuario[]; children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UsuarioSistema | null | undefined>(undefined);

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (roles?.length && !roles.includes(session.tipoUsuario)) {
      router.replace(session.tipoUsuario === "ADMIN" ? "/dashboard" : "/activo-fijo");
      return;
    }
    setUser(session);
  }, [roles, router]);

  if (user === undefined) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">Validando sesion...</CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
