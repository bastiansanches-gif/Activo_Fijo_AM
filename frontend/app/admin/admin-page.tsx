"use client";

import { KeyRound, Palette, ShieldCheck, UserRound } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth-service";

export default function AdminPage() {
  const user = authService.getSession();

  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Configuracion</h2>
          <p className="text-muted-foreground">Preferencias y datos del usuario logueado.</p>
        </div>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden border-blue-100 shadow-soft">
            <CardHeader className="bg-[#0057B8] text-white">
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Mi perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <ProfileItem label="Nombre" value={`${user?.nomUsuario ?? ""} ${user?.apellidoPaterno ?? ""}`.trim() || "No disponible"} />
              <ProfileItem label="Correo" value={user?.email ?? "No disponible"} />
              <ProfileItem label="Cargo" value={user?.cargo ?? "No disponible"} />
              <ProfileItem label="Dimension" value={user?.dimension ?? "Sin dimension"} />
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs uppercase text-muted-foreground">Perfil</p>
                <Badge className="mt-2">{user?.tipoUsuario ?? "Sin rol"}</Badge>
              </div>
              <ProfileItem label="Codigo usuario" value={user?.codUsuario ?? "No disponible"} />
            </CardContent>
          </Card>

          <Card className="border-blue-100 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-[#0057B8]" />
                Preferencias visuales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl bg-[#F5F8FF] p-4">
                <p className="text-sm font-medium">Tema corporativo</p>
                <p className="text-sm text-muted-foreground">Azul Audiomusica aplicado al menu lateral y acciones principales.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["#0057B8", "#003B7A", "#006FE6"].map((color) => (
                  <div key={color} className="h-12 rounded-2xl shadow-inner" style={{ backgroundColor: color }} title={color} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="border-blue-100 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-[#0057B8]" />
              Cambiar contrasena
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <Input type="password" placeholder="Contrasena actual" />
            <Input type="password" placeholder="Nueva contrasena" />
            <Button type="button" disabled>
              Proximamente
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-[#F5F8FF] shadow-soft">
          <CardContent className="flex gap-3 p-5 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0057B8]" />
            La creacion de usuarios, roles y accesos se administra exclusivamente desde el modulo Usuarios por perfiles Admin.
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
