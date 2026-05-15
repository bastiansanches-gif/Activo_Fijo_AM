"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, KeyRound, Pencil, Plus, Search, ShieldCheck, UserCog } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authService } from "@/services/auth-service";
import { ApiError, apiClient } from "@/services/apiClient";
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
  const [editingUser, setEditingUser] = useState<UsuarioApi | null>(null);
  const [passwordUser, setPasswordUser] = useState<UsuarioApi | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [createError, setCreateError] = useState("");
  const [editError, setEditError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [editSuccessOpen, setEditSuccessOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const session = authService.getSession();
  const canCreateUser = session?.tipoUsuario === "ADMIN";
  const queryClient = useQueryClient();
  const usuarios = useQuery({ queryKey: ["usuarios"], queryFn: usuariosService.list });
  const roles = useQuery({ queryKey: ["roles"], queryFn: () => apiClient<RolApi[]>("/roles"), enabled: canCreateUser });
  const dimensionesDisponibles = useQuery({ queryKey: ["dimensiones"], queryFn: dimensionesService.list, enabled: canCreateUser });
  const licencias = useQuery({ queryKey: ["cuentas"], queryFn: licenciasService.list, enabled: canCreateUser });

  const createUser = useMutation({
    mutationFn: async (payload: { user: Partial<UsuarioApi>; licencias: number[] }) => {
      return await usuariosService.create({ ...payload.user, IdCuentas: payload.licencias });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setCreateError("");
      setFormKey((current) => current + 1);
      setOpenCreate(false);
      setSuccessOpen(true);
    },
    onError: (error) => {
      setCreateError(mapUsuarioError(error));
    },
  });
  const updateUser = useMutation({
    mutationFn: async (payload: { id: number; user: Partial<UsuarioApi>; licencias: number[] }) => {
      return await usuariosService.update(payload.id, { ...payload.user, IdCuentas: payload.licencias });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setEditError("");
      setEditingUser(null);
      setEditSuccessOpen(true);
    },
    onError: (error) => {
      setEditError(mapUsuarioError(error));
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
                <Input className="pl-9" placeholder="Buscar por rut, nombre, apellidos, correo, rol o dimension" value={query} onChange={(event) => setQuery(event.target.value)} />
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
                    <TableHead>Rol</TableHead>
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
                              <Button variant="outline" size="sm" onClick={() => {
                                setEditError("");
                                setEditingUser(usuario);
                              }}>
                                <Pencil className="h-4 w-4" />
                                Editar acceso
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Generar contrasena"
                                onClick={() => {
                                  setPasswordUser(usuario);
                                  setGeneratedPassword(generateTemporaryPassword());
                                }}
                              >
                                <KeyRound className="h-4 w-4" />
                              </Button>
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
        <Dialog open={openCreate} onOpenChange={(open) => {
          setOpenCreate(open);
          if (open) setCreateError("");
        }}>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear usuario</DialogTitle>
            </DialogHeader>
            <CreateUserForm
              key={formKey}
              roles={roles.data ?? []}
              dimensiones={dimensionesDisponibles.data ?? []}
              licencias={licencias.data ?? []}
              isSaving={createUser.isPending}
              errorMessage={createError}
              onSubmit={(user, selectedLicencias) => createUser.mutate({ user, licencias: selectedLicencias })}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registro completado</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Usuario registrado correctamente.</p>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setSuccessOpen(false)}>Aceptar</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={!!editingUser} onOpenChange={(open) => {
          if (!open && !updateUser.isPending) {
            setEditingUser(null);
            setEditError("");
          }
        }}>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar acceso</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <UserAccessForm
                mode="edit"
                initialUser={editingUser}
                roles={roles.data ?? []}
                dimensiones={dimensionesDisponibles.data ?? []}
                licencias={licencias.data ?? []}
                isSaving={updateUser.isPending}
                errorMessage={editError}
                submitLabel="Guardar cambios"
                confirmLabel="Confirmar cambios"
                onSubmit={(user, selectedLicencias) => {
                  const id = editingUser.idUsuario ?? editingUser.IdUsuario;
                  if (!id) return;
                  updateUser.mutate({ id, user, licencias: selectedLicencias });
                }}
              />
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={editSuccessOpen} onOpenChange={setEditSuccessOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Acceso actualizado</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Los datos del usuario fueron actualizados correctamente.</p>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setEditSuccessOpen(false)}>Aceptar</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={!!passwordUser} onOpenChange={(open) => {
          if (!open) {
            setPasswordUser(null);
            setGeneratedPassword("");
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contrasena temporal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Clave generada para {passwordUser ? getFullName(passwordUser) : "usuario"}. El backend actual no persiste contrasenas; usala como clave temporal hasta conectar el endpoint de seguridad.
              </p>
              <div className="rounded-2xl border bg-secondary/40 p-4 font-mono text-lg font-semibold tracking-normal">
                {generatedPassword}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setGeneratedPassword(generateTemporaryPassword())}>
                  <KeyRound className="h-4 w-4" />
                  Generar otra
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(generatedPassword);
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Copiar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}

function generateTemporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const symbols = "!#$%";
  const bytes = new Uint32Array(12);
  crypto.getRandomValues(bytes);
  const core = Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
  return `${core.slice(0, 4)}-${core.slice(4, 8)}-${core.slice(8)}${symbols[bytes[0] % symbols.length]}`;
}

function getFullName(usuario: UsuarioApi) {
  return `${usuario.nombreUsuario ?? usuario.NombreUsuario ?? ""} ${usuario.apellidoPaterno ?? usuario.ApellidoPaterno ?? ""} ${usuario.apellidoMaterno ?? usuario.ApellidoMaterno ?? ""}`.trim();
}

function getCargo(usuario: UsuarioApi) {
  return usuario.rol?.nombreRol ?? usuario.Rol?.NombreRol ?? usuario.Rol?.nombreRol ?? "Sin rol";
}

function getDimension(usuario: UsuarioApi) {
  return String(usuario.dimension?.nombreDimension ?? usuario.Dimension?.NombreDimension ?? usuario.Dimension?.nombreDimension ?? usuario.idDimension ?? usuario.IdDimension ?? "Sin dimension");
}

function getLicencias(usuario: UsuarioApi) {
  const value = usuario.cuentas ?? usuario.Cuentas;
  if (!Array.isArray(value) || !value.length) return "Sin licencias";
  return value
    .map((item) => item.nombreCuenta ?? item.NombreCuenta ?? item.idCuenta ?? item.IdCuenta)
    .filter(Boolean)
    .join(", ");
}

function mapUsuarioError(error: unknown) {
  if (error instanceof ApiError && error.message.includes("Ya existe un usuario registrado con este RUT")) {
    return "El RUT ingresado ya existe en el sistema.";
  }
  return "No se pudo guardar el usuario. Revisa los datos e intenta nuevamente.";
}

function getRoleNameById(roles: RolApi[], id: number) {
  return roles.find((rol) => getId(rol, "idRol", "IdRol") === id)?.nombreRol
    ?? roles.find((rol) => getId(rol, "idRol", "IdRol") === id)?.NombreRol
    ?? String(id || "");
}

function getDimensionNameById(
  dimensiones: Array<{ idDimension?: number; IdDimension?: number; numeroDimension?: string; NumeroDimension?: string; nombreDimension?: string; NombreDimension?: string }>,
  id: number,
) {
  const dimension = dimensiones.find((item) => getId(item, "idDimension", "IdDimension") === id);
  if (!dimension) return String(id || "");
  return `${getText(dimension, "numeroDimension", "NumeroDimension")} - ${getText(dimension, "nombreDimension", "NombreDimension")}`;
}

function getCuentaNamesByIds(
  cuentas: Array<{ idCuenta?: number; IdCuenta?: number; nombreCuenta?: string; NombreCuenta?: string }>,
  ids: number[],
) {
  return cuentas
    .filter((cuenta) => ids.includes(getId(cuenta, "idCuenta", "IdCuenta")))
    .map((cuenta) => getText(cuenta, "nombreCuenta", "NombreCuenta"));
}

function SummaryList({ rows }: { rows: Array<[string, string | number | null | undefined]> }) {
  return (
    <dl className="grid gap-3 rounded-2xl border bg-secondary/30 p-4 text-sm sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="space-y-1">
          <dt className="text-xs font-medium uppercase tracking-normal text-muted-foreground">{label}</dt>
          <dd className="break-words font-medium text-foreground">{value || "Sin dato"}</dd>
        </div>
      ))}
    </dl>
  );
}

function CreateUserForm(props: Omit<UserAccessFormProps, "mode" | "submitLabel" | "confirmLabel">) {
  return <UserAccessForm {...props} mode="create" submitLabel="Guardar usuario" confirmLabel="Confirmar registro" />;
}

type UserAccessFormProps = {
  mode: "create" | "edit";
  initialUser?: UsuarioApi;
  roles: RolApi[];
  dimensiones: Array<{ idDimension?: number; IdDimension?: number; numeroDimension?: string; NumeroDimension?: string; nombreDimension?: string; NombreDimension?: string }>;
  licencias: Array<{ idCuenta?: number; IdCuenta?: number; nombreCuenta?: string; NombreCuenta?: string }>;
  isSaving: boolean;
  errorMessage: string;
  submitLabel: string;
  confirmLabel: string;
  onSubmit: (user: Partial<UsuarioApi>, licencias: number[]) => void;
};

function UserAccessForm({
  mode,
  initialUser,
  roles,
  dimensiones,
  licencias,
  isSaving,
  errorMessage,
  submitLabel,
  confirmLabel,
  onSubmit,
}: UserAccessFormProps) {
  const initialLicencias = useMemo(
    () => (initialUser?.cuentas ?? initialUser?.Cuentas ?? [])
      .map((cuenta) => getId(cuenta, "idCuenta", "IdCuenta"))
      .filter(Boolean),
    [initialUser],
  );
  const [selectedLicencias, setSelectedLicencias] = useState<number[]>(initialLicencias);
  const [pending, setPending] = useState<Partial<UsuarioApi> | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending({
      Rut: String(formData.get("rut") ?? ""),
      NombreUsuario: String(formData.get("nombre") ?? ""),
      ApellidoPaterno: String(formData.get("apellidoPaterno") ?? ""),
      ApellidoMaterno: String(formData.get("apellidoMaterno") ?? "") || null,
      CorreoCorporativo: String(formData.get("correo") ?? ""),
      FechaIngreso: String(formData.get("fechaIngreso") ?? ""),
      FinContrato: String(formData.get("fechaTermino") ?? "") || null,
      IdRol: Number(formData.get("idRol")),
      IdDimension: Number(formData.get("idDimension")),
      Activo: formData.get("activo") === "true",
      IdCuentas: selectedLicencias,
    });
  }

  return (
    <>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        {errorMessage && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{errorMessage}</p>}
        <Field name="rut" label="RUT" defaultValue={initialUser?.rut ?? initialUser?.Rut ?? ""} required />
        <Field name="nombre" label="Nombre" defaultValue={initialUser?.nombreUsuario ?? initialUser?.NombreUsuario ?? ""} required />
        <Field name="apellidoPaterno" label="Apellido paterno" defaultValue={initialUser?.apellidoPaterno ?? initialUser?.ApellidoPaterno ?? ""} required />
        <Field name="apellidoMaterno" label="Apellido materno" defaultValue={initialUser?.apellidoMaterno ?? initialUser?.ApellidoMaterno ?? ""} />
        <Field name="correo" label="Correo corporativo" type="email" defaultValue={initialUser?.correoCorporativo ?? initialUser?.CorreoCorporativo ?? ""} required />
        <Field name="fechaIngreso" label="Fecha ingreso" type="date" defaultValue={formatDateInput(initialUser?.fechaIngreso ?? initialUser?.FechaIngreso)} required />
        <Field name="fechaTermino" label="Fecha termino" type="date" defaultValue={formatDateInput(initialUser?.finContrato ?? initialUser?.FinContrato)} />
        <Select name="idDimension" label="Dimension" defaultValue={String(initialUser?.idDimension ?? initialUser?.IdDimension ?? "")} required>
          <option value="" disabled>Seleccionar dimension</option>
          {dimensiones.map((dimension) => {
            const id = getId(dimension, "idDimension", "IdDimension");
            return <option key={id} value={id}>{`${getText(dimension, "numeroDimension", "NumeroDimension")} - ${getText(dimension, "nombreDimension", "NombreDimension")}`}</option>;
          })}
        </Select>
        <Select name="idRol" label="Rol" defaultValue={String(initialUser?.idRol ?? initialUser?.IdRol ?? "")} required>
          <option value="" disabled>Seleccionar rol</option>
          {roles.map((rol) => {
            const id = getId(rol, "idRol", "IdRol");
            return <option key={id} value={id}>{getText(rol, "nombreRol", "NombreRol")}</option>;
          })}
        </Select>
        <Select name="activo" label="Estado" defaultValue={String(initialUser?.activo ?? initialUser?.Activo ?? true)} required>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </Select>
        <div className="space-y-2 md:col-span-2">
          <p className="text-sm font-medium">Licencias</p>
          <div className="grid gap-2 rounded-2xl border p-3 sm:grid-cols-2">
            {licencias.map((licencia) => {
              const id = getId(licencia, "idCuenta", "IdCuenta");
              return (
                <label key={id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedLicencias.includes(id)}
                    onChange={(event) => setSelectedLicencias((current) => event.target.checked ? [...current, id] : current.filter((item) => item !== id))}
                  />
                  {getText(licencia, "nombreCuenta", "NombreCuenta")}
                </label>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-2 md:col-span-2">
          <Button type="submit" disabled={isSaving}>{isSaving ? "Guardando..." : submitLabel}</Button>
        </div>
      </form>

      <Dialog open={!!pending} onOpenChange={(open) => !open && !isSaving && setPending(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirmar registro</DialogTitle>
          </DialogHeader>
          {pending && (
            <SummaryList
              rows={[
                ["RUT", pending.Rut],
                ["Nombre completo", [pending.NombreUsuario, pending.ApellidoPaterno, pending.ApellidoMaterno].filter(Boolean).join(" ")],
                ["Correo", pending.CorreoCorporativo],
                ["Cargo", getRoleNameById(roles, Number(pending.IdRol))],
                ["Dimension", getDimensionNameById(dimensiones, Number(pending.IdDimension))],
                ["Fecha ingreso", pending.FechaIngreso],
                ["Fecha termino contrato", pending.FinContrato || "Sin termino"],
                ["Licencias seleccionadas", getCuentaNamesByIds(licencias, selectedLicencias).join(", ") || "Sin licencias"],
                ["Estado", pending.Activo ? "Activo" : "Inactivo"],
              ]}
            />
          )}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={isSaving} onClick={() => setPending(null)}>Cancelar</Button>
            <Button type="button" disabled={isSaving} onClick={() => {
              if (!pending) return;
              onSubmit(pending, selectedLicencias);
              setPending(null);
            }}>
              {isSaving ? "Guardando..." : confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatDateInput(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
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
