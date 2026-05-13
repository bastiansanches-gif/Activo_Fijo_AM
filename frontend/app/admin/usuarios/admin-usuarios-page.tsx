"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Plus, Search, ShieldCheck, UserCog } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authService } from "@/services/auth-service";
import { apiClient } from "@/services/apiClient";
import { dimensionesService } from "@/services/dimensionesService";
import { getId, getText } from "@/services/catalogos-service";
import { licenciasService } from "@/services/licencias-service";
import { usuariosService, type UsuarioApi } from "@/services/usuarios-service";

type RolApi = { idRol?: number; IdRol?: number; nombreRol?: string; NombreRol?: string };

export default function AdminUsuariosPage() {
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("Todos");
  const [dimension, setDimension] = useState("Todos");
  const [openCreate, setOpenCreate] = useState(false);
  const session = authService.getSession();
  const canCreateUser = session?.tipoUsuario === "ADMIN";
  const queryClient = useQueryClient();
  const usuarios = useQuery({ queryKey: ["usuarios"], queryFn: usuariosService.list });
  const roles = useQuery({ queryKey: ["roles"], queryFn: () => apiClient<RolApi[]>("/roles"), enabled: canCreateUser });
  const dimensionesDisponibles = useQuery({ queryKey: ["dimensiones"], queryFn: dimensionesService.list, enabled: canCreateUser });
  const licencias = useQuery({ queryKey: ["licencias"], queryFn: licenciasService.list, enabled: canCreateUser });

  const createUser = useMutation({
    mutationFn: async (payload: { user: Partial<UsuarioApi>; licencias: number[] }) => {
      const created = await usuariosService.create(payload.user);
      const idUsuario = created.idUsuario ?? created.IdUsuario;
      if (idUsuario) {
        await Promise.all(payload.licencias.map((idLicencia) => licenciasService.assign(idUsuario, idLicencia)));
      }
      return created;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setOpenCreate(false);
    },
  });

  const dimensiones = useMemo(
    () => ["Todos", ...Array.from(new Set((usuarios.data ?? []).map(getDimension).filter(Boolean)))],
    [usuarios.data],
  );
  const filtered = useMemo(
    () =>
      (usuarios.data ?? []).filter((usuario) => {
        const active = usuario.activo ?? usuario.Activo;
        const matchesEstado = estado === "Todos" || (estado === "Activo" ? active : !active);
        const userDimension = getDimension(usuario);
        const matchesDimension = dimension === "Todos" || userDimension === dimension;
        const matchesQuery = [
          usuario.rut ?? usuario.Rut,
          usuario.nombreUsuario ?? usuario.NombreUsuario,
          usuario.apellidoPaterno ?? usuario.ApellidoPaterno,
          usuario.apellidoMaterno ?? usuario.ApellidoMaterno,
          usuario.correoCorporativo ?? usuario.CorreoCorporativo,
          getCargo(usuario),
          userDimension,
        ].join(" ").toLowerCase().includes(query.toLowerCase());
        return matchesEstado && matchesDimension && matchesQuery;
      }),
    [dimension, estado, query, usuarios.data],
  );

  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-normal">Usuarios</h2>
            <p className="text-muted-foreground">Consulta, busqueda, filtros y edicion controlada de usuarios.</p>
          </div>
          {canCreateUser && (
            <Button onClick={() => setOpenCreate(true)}>
              <Plus className="h-4 w-4" />
              Crear usuario
            </Button>
          )}
        </div>

        <Card className="border-blue-100 bg-[#F5F8FF] shadow-soft">
          <CardContent className="flex gap-3 p-5 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0057B8]" />
            La creacion de accesos queda reservada a acciones Admin controladas; esta vista prioriza consulta, filtros y edicion permitida.
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-[#0057B8]" />
              Usuarios del sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usuarios.isLoading && <p className="text-sm text-muted-foreground">Cargando usuarios...</p>}
            {usuarios.error && <p className="text-sm text-destructive">No se pudo conectar con usuarios.</p>}
            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Buscar por rut, nombre, apellidos, correo, cargo o dimension" value={query} onChange={(event) => setQuery(event.target.value)} />
              </div>
              <select className="h-10 rounded-2xl border bg-background px-3 text-sm" value={estado} onChange={(event) => setEstado(event.target.value)}>
                {["Todos", "Activo", "Inactivo"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <select className="h-10 rounded-2xl border bg-background px-3 text-sm" value={dimension} onChange={(event) => setDimension(event.target.value)}>
                {dimensiones.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre completo</TableHead>
                    <TableHead>Rut</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Dimension</TableHead>
                    <TableHead>Licencias asociadas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((usuario) => {
                    const id = usuario.idUsuario ?? usuario.IdUsuario;
                    const nombre = `${usuario.nombreUsuario ?? usuario.NombreUsuario ?? ""} ${usuario.apellidoPaterno ?? usuario.ApellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? usuario.ApellidoMaterno ?? ""}`.trim();
                    const userDimension = getDimension(usuario);
                    const activo = usuario.activo ?? usuario.Activo;
                    return (
                      <TableRow key={id}>
                        <TableCell className="font-medium">{nombre}</TableCell>
                        <TableCell>{usuario.rut ?? usuario.Rut ?? "Sin rut"}</TableCell>
                        <TableCell>{usuario.correoCorporativo ?? usuario.CorreoCorporativo ?? "Sin correo"}</TableCell>
                        <TableCell>{getCargo(usuario)}</TableCell>
                        <TableCell>{userDimension}</TableCell>
                        <TableCell>{getLicencias(usuario)}</TableCell>
                        <TableCell><Badge variant={activo ? "success" : "secondary"}>{activo ? "Activo" : "Inactivo"}</Badge></TableCell>
                        <TableCell>
                          {canCreateUser ? (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Editar acceso</Button>
                              <Button variant="ghost" size="icon" aria-label="Resetear contrasena"><KeyRound className="h-4 w-4" /></Button>
                            </div>
                          ) : (
                            <Badge variant="secondary">Solo lectura</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear usuario</DialogTitle>
            </DialogHeader>
            <CreateUserForm
              roles={roles.data ?? []}
              dimensiones={dimensionesDisponibles.data ?? []}
              licencias={licencias.data ?? []}
              isSaving={createUser.isPending}
              onSubmit={(user, selectedLicencias) => createUser.mutate({ user, licencias: selectedLicencias })}
            />
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}

function getCargo(usuario: UsuarioApi) {
  const cargo = usuario.cargo ?? usuario.Cargo;
  if (typeof cargo === "string") return cargo || "Sin cargo";
  return usuario.cargoNombre ?? usuario.CargoNombre ?? cargo?.nombreRol ?? cargo?.NombreRol ?? usuario.rol?.nombreRol ?? usuario.Rol?.NombreRol ?? "Sin cargo";
}

function getDimension(usuario: UsuarioApi) {
  return String(usuario.dimension?.nombreDimension ?? usuario.Dimension?.NombreDimension ?? usuario.Dimension?.nombreDimension ?? usuario.idDimension ?? usuario.IdDimension ?? "Sin dimension");
}

function getLicencias(usuario: UsuarioApi) {
  const value = usuario.usuarioLicencias ?? usuario.UsuarioLicencias;
  if (!Array.isArray(value) || !value.length) return "Sin licencias";
  return value
    .map((item) => item.licencia?.nombreLicencia ?? item.Licencia?.NombreLicencia ?? item.Licencia?.nombreLicencia ?? item.idLicencia ?? item.IdLicencia)
    .filter(Boolean)
    .join(", ");
}

function CreateUserForm({
  roles,
  dimensiones,
  licencias,
  isSaving,
  onSubmit,
}: {
  roles: RolApi[];
  dimensiones: Array<{ idDimension?: number; IdDimension?: number; numeroDimension?: string; NumeroDimension?: string; nombreDimension?: string; NombreDimension?: string }>;
  licencias: Array<{ idLicencia?: number; IdLicencia?: number; nombreLicencia?: string; NombreLicencia?: string }>;
  isSaving: boolean;
  onSubmit: (user: Partial<UsuarioApi>, licencias: number[]) => void;
}) {
  const [selectedLicencias, setSelectedLicencias] = useState<number[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit(
      {
        Rut: String(formData.get("rut") ?? ""),
        NombreUsuario: String(formData.get("nombre") ?? ""),
        ApellidoPaterno: String(formData.get("apellidoPaterno") ?? ""),
        ApellidoMaterno: String(formData.get("apellidoMaterno") ?? "") || null,
        CorreoCorporativo: String(formData.get("correo") ?? ""),
        Cargo: String(formData.get("cargo") ?? ""),
        FechaIngreso: String(formData.get("fechaIngreso") ?? ""),
        finContrato: String(formData.get("fechaTermino") ?? "") || null,
        IdRol: Number(formData.get("idRol")),
        IdDimension: Number(formData.get("idDimension")),
        Activo: true,
      },
      selectedLicencias,
    );
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <Field name="rut" label="RUT" required />
      <Field name="nombre" label="Nombre" required />
      <Field name="apellidoPaterno" label="Apellido paterno" required />
      <Field name="apellidoMaterno" label="Apellido materno" />
      <Field name="correo" label="Correo corporativo" type="email" required />
      <Field name="cargo" label="Cargo" required />
      <Field name="fechaIngreso" label="Fecha ingreso" type="date" required />
      <Field name="fechaTermino" label="Fecha termino" type="date" />
      <Select name="idDimension" label="Dimension" required>
        {dimensiones.map((dimension) => {
          const id = getId(dimension, "idDimension", "IdDimension");
          return <option key={id} value={id}>{`${getText(dimension, "numeroDimension", "NumeroDimension")} - ${getText(dimension, "nombreDimension", "NombreDimension")}`}</option>;
        })}
      </Select>
      <Select name="idRol" label="Rol" required>
        {roles.map((rol) => {
          const id = getId(rol, "idRol", "IdRol");
          return <option key={id} value={id}>{getText(rol, "nombreRol", "NombreRol")}</option>;
        })}
      </Select>
      <div className="space-y-2 md:col-span-2">
        <p className="text-sm font-medium">Licencias</p>
        <div className="grid gap-2 rounded-2xl border p-3 sm:grid-cols-2">
          {licencias.map((licencia) => {
            const id = getId(licencia, "idLicencia", "IdLicencia");
            return (
              <label key={id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedLicencias.includes(id)}
                  onChange={(event) => setSelectedLicencias((current) => event.target.checked ? [...current, id] : current.filter((item) => item !== id))}
                />
                {getText(licencia, "nombreLicencia", "NombreLicencia")}
              </label>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end gap-2 md:col-span-2">
        <Button type="submit" disabled={isSaving}>{isSaving ? "Guardando..." : "Guardar usuario"}</Button>
      </div>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="space-y-2 text-sm font-medium">
      {label}
      <Input {...inputProps} />
    </label>
  );
}

function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="space-y-2 text-sm font-medium">
      {label}
      <select className="h-10 w-full rounded-2xl border bg-background px-3 text-sm" {...props}>
        {children}
      </select>
    </label>
  );
}
