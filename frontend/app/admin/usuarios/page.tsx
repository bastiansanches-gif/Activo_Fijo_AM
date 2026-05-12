"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminCrud } from "@/components/admin/AdminCrud";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { usuariosService } from "@/services/usuarios-service";

export default function UsuariosPage() {
  const { data = [], isLoading, error } = useQuery({ queryKey: ["usuarios"], queryFn: usuariosService.list });
  const rows = data.map((usuario) => ({
    id: usuario.idUsuario,
    nombre: `${usuario.nombreUsuario} ${usuario.apellidoPaterno}`,
    rol: usuario.idRol,
    dimension: usuario.idDimension,
    activo: usuario.activo,
  }));

  return (
    <RoleGuard roles={["ADMIN"]}>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-normal">Usuarios</h2>
        {isLoading && <p className="text-sm text-muted-foreground">Cargando usuarios...</p>}
        {error && <p className="text-sm text-destructive">No se pudo conectar con usuarios.</p>}
        <AdminCrud title="Usuarios" rows={rows} />
      </div>
    </RoleGuard>
  );
}
