"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SmartSelector, type SmartSelectorOption } from "@/components/selectors/SmartSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { activoFijoService } from "@/services/activo-fijo-service";
import { authService } from "@/services/auth-service";
import { catalogosService, getId, getText } from "@/services/catalogos-service";
import { dimensionesService, type Dimension } from "@/services/dimensionesService";
import { usuariosService, type UsuarioApi } from "@/services/usuarios-service";
import { assetTypes, getAssetTypeName } from "./AssetTypeCards";

const schema = z.object({
  tipoActivo: z.string().min(1),
  tipoAsignacion: z.enum(["Usuario", "Tienda", "Area", "Stock Bodega"]),
  pais: z.string().min(1),
  area: z.string().min(1),
  idDimension: z.coerce.number().int().positive(),
  idUsuario: z.coerce.number().int().positive().nullable().optional(),
  ram: z.coerce.number().int().positive().nullable().optional(),
  idMarca: z.coerce.number().int().positive().optional(),
  marca: z.string().optional(),
  idModelo: z.coerce.number().int().positive().optional(),
  modelo: z.string().optional(),
  idProcesador: z.coerce.number().int().positive().nullable().optional(),
  procesador: z.string().optional(),
  tipoDisco: z.string().optional(),
  capacidadDisco: z.string().optional(),
  idDiscoDuro: z.coerce.number().int().positive().nullable().optional(),
  serial: z.string().min(2),
  numeroFactura: z.string().optional(),
  rutProveedor: z.string().optional(),
  fechaCompra: z.string().optional(),
  detalles: z.string().optional(),
  idEstadoActivo: z.coerce.number().int().positive(),
  estadoActivo: z.string().min(1),
});

type FormData = z.infer<typeof schema>;
type AssignmentType = FormData["tipoAsignacion"];

const assignmentTypes: Array<{ value: AssignmentType; label: string; detail: string }> = [
  { value: "Usuario", label: "Usuario", detail: "Asocia el activo a una persona y a su dimension operacional." },
  { value: "Tienda", label: "Tienda", detail: "Asigna solo a dimension, normalmente Retail/Tienda." },
  { value: "Area", label: "Area", detail: "Asigna solo a una dimension organizacional." },
  { value: "Stock Bodega", label: "Stock Bodega", detail: "Mantiene el activo disponible en bodega." },
];

const diskTypes = ["SSD", "HDD", "NVMe"];
const diskCapacities = ["256GB", "512GB", "1TB", "2TB"];
const chipCompanies = ["Entel", "Claro", "Movistar", "WOM"];
const emptyUserOption = { value: "", label: "Sin usuario asignado / Solo dimension" };

const technicalAssets = new Set(["notebook", "aio", "servidor"]);
const storageAssets = new Set(["notebook", "aio", "servidor", "disco"]);
const noUserAssets = new Set(["impresora"]);
const minimalChipAssets = new Set(["chip"]);

export function ActivoFijoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const session = authService.getSession();
  const selectedSlug = searchParams.get("tipo");
  const selectedType = getAssetTypeName(selectedSlug);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const marcas = useQuery({ queryKey: ["catalogos", "marcas"], queryFn: catalogosService.marcas.list });
  const modelos = useQuery({ queryKey: ["catalogos", "modelos"], queryFn: catalogosService.modelos.list });
  const procesadores = useQuery({ queryKey: ["catalogos", "procesadores"], queryFn: catalogosService.procesadores.list });
  const discosDuros = useQuery({ queryKey: ["catalogos", "discos-duros"], queryFn: catalogosService.discosDuros.list });
  const estadosActivo = useQuery({ queryKey: ["catalogos", "estados-activo"], queryFn: catalogosService.estadosActivo.list });
  const dimensiones = useQuery({ queryKey: ["dimensiones"], queryFn: dimensionesService.list });
  const usuarios = useQuery({ queryKey: ["usuarios"], queryFn: usuariosService.list });

  const normalizedDimensions = useMemo(() => (dimensiones.data ?? []).map(normalizeDimension), [dimensiones.data]);
  const paises = unique(normalizedDimensions.map((item) => item.pais));

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipoActivo: selectedType,
      tipoAsignacion: noUserAssets.has(selectedSlug ?? "") ? "Tienda" : "Usuario",
      pais: "",
      area: "",
      idDimension: 0,
      idUsuario: null,
      ram: null,
      idMarca: 1,
      marca: "",
      idModelo: 1,
      modelo: "",
      idProcesador: null,
      procesador: "",
      tipoDisco: selectedSlug === "chip" ? "" : "SSD",
      capacidadDisco: selectedSlug === "chip" ? "" : "512GB",
      idDiscoDuro: null,
      serial: "",
      numeroFactura: "",
      rutProveedor: "",
      fechaCompra: new Date().toISOString().slice(0, 10),
      detalles: "",
      idEstadoActivo: 1,
      estadoActivo: "Disponible",
    },
  });

  const tipoAsignacion = form.watch("tipoAsignacion");
  const pais = form.watch("pais");
  const area = form.watch("area");
  const isChip = minimalChipAssets.has(selectedSlug ?? "");
  const isPrinter = selectedSlug === "impresora";
  const showUser = tipoAsignacion === "Usuario" && !isPrinter;
  const showTechnical = technicalAssets.has(selectedSlug ?? "");
  const showStorage = storageAssets.has(selectedSlug ?? "");
  const showBrandModel = !isChip;

  const areas = unique(normalizedDimensions.filter((item) => item.pais === pais).map((item) => item.area));
  const subAreas = normalizedDimensions.filter((item) => item.pais === pais && item.area === area);
  const allowedAssignments = assignmentTypes.filter((item) => !(isPrinter && item.value === "Usuario"));

  const marcaOptions = useMemo(
    () => (marcas.data ?? []).map((item) => ({ value: String(getId(item, "idMarca", "IdMarca")), label: getText(item, "nombreMarca", "NombreMarca") })),
    [marcas.data],
  );
  const modeloOptions = useMemo(
    () => (modelos.data ?? []).map((item) => ({ value: String(getId(item, "idModelo", "IdModelo")), label: getText(item, "nombreModelo", "NombreModelo") })),
    [modelos.data],
  );
  const procesadorOptions = useMemo(
    () => (procesadores.data ?? []).map((item) => ({ value: String(getId(item, "idProcesador", "IdProcesador")), label: getText(item, "nombreProcesador", "NombreProcesador") })),
    [procesadores.data],
  );
  const estadoOptions = useMemo(
    () => (estadosActivo.data ?? []).map((item) => ({ value: String(getId(item, "idEstadoActivo", "IdEstadoActivo")), label: getText(item, "nombreEstado", "NombreEstado") })),
    [estadosActivo.data],
  );
  const usuarioOptions = useMemo(() => [emptyUserOption, ...(usuarios.data ?? []).map(toUsuarioOption)], [usuarios.data]);

  useEffect(() => {
    form.setValue("tipoActivo", selectedType);
    if (isPrinter) {
      form.setValue("tipoAsignacion", "Tienda");
      form.setValue("idUsuario", null);
    }
  }, [form, isPrinter, selectedType]);

  useEffect(() => {
    if (!pais && paises[0]) form.setValue("pais", paises[0]);
  }, [form, pais, paises]);

  useEffect(() => {
    if (!area && areas[0]) form.setValue("area", areas[0]);
  }, [area, areas, form]);

  useEffect(() => {
    if (!form.getValues("idDimension") && subAreas[0]) form.setValue("idDimension", subAreas[0].idDimension);
  }, [form, subAreas]);

  useEffect(() => {
    if (!form.getValues("idMarca")) applyFirst(marcaOptions, (option) => {
      form.setValue("idMarca", Number(option.value));
      form.setValue("marca", option.label);
    });
    if (!form.getValues("idModelo")) applyFirst(modeloOptions, (option) => {
      form.setValue("idModelo", Number(option.value));
      form.setValue("modelo", option.label);
    });
    if (!form.getValues("idEstadoActivo")) applyFirst(estadoOptions, (option) => {
      form.setValue("idEstadoActivo", Number(option.value));
      form.setValue("estadoActivo", option.label);
    });
  }, [estadoOptions, form, marcaOptions, modeloOptions]);

  const createActivo = useMutation({
    mutationFn: activoFijoService.create,
    onSuccess: () => {
      setSuccess("Activo creado correctamente.");
      router.push("/activo-fijo");
    },
    onError: () => setError("No se pudo crear el activo. Revisa los datos e intenta nuevamente."),
  });

  if (!selectedSlug || !assetTypes.some((item) => item.slug === selectedSlug)) {
    return <Notice type="error" message="Selecciona primero un tipo de activo desde las cards." />;
  }

  if (!session) {
    return <Notice type="error" message="No existe usuario logueado. Inicia sesion para registrar activos." />;
  }

  async function onSubmit(values: FormData) {
    setError("");
    let idDiscoDuro = values.idDiscoDuro ?? null;
    if (showStorage) {
      idDiscoDuro = await resolveDisco(values.tipoDisco ?? "SSD", values.capacidadDisco ?? "512GB");
    }

    await createActivo.mutateAsync({
      IdDimension: values.idDimension,
      IdUsuario: showUser ? values.idUsuario ?? null : null,
      RAM: showTechnical ? values.ram ?? null : null,
      IdMarca: values.idMarca ?? 1,
      IdModelo: values.idModelo ?? 1,
      IdProcesador: showTechnical ? values.idProcesador ?? null : null,
      IdDiscoDuro: idDiscoDuro,
      Serial: values.serial,
      NumeroFactura: values.numeroFactura ?? "",
      RutProveedor: values.rutProveedor ?? "",
      FechaCompra: values.fechaCompra ? new Date(values.fechaCompra).toISOString() : new Date().toISOString(),
      Detalles: values.detalles ?? null,
      IdUsuarioRegistro: session?.idUsuario ?? null,
      IdEstadoActivo: values.idEstadoActivo,
      Activo: true,
    });
  }

  async function resolveDisco(tipoDisco: string, capacidadDisco: string) {
    const capacidadGB = parseCapacity(capacidadDisco);
    const current = (discosDuros.data ?? []).find((item) => {
      const tipo = getText(item, "tipoDisco", "TipoDisco");
      const capacidad = getId(item, "capacidadGB", "CapacidadGB");
      return tipo === tipoDisco && capacidad === capacidadGB;
    });
    if (current) return getId(current, "idDiscoDuro", "IdDiscoDuro");
    const created = await catalogosService.discosDuros.createDisco(tipoDisco, capacidadGB);
    await queryClient.invalidateQueries({ queryKey: ["catalogos", "discos-duros"] });
    return getId(created, "idDiscoDuro", "IdDiscoDuro");
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="border-blue-100 bg-[#F5F8FF] shadow-soft">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0057B8] text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Registrado por</p>
              <p className="font-semibold">{`${session.nomUsuario} ${session.apellidoPaterno ?? ""}`.trim()}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">El tecnico responsable se obtiene desde la sesion actual.</p>
        </CardContent>
      </Card>

      {success && <Notice type="success" message={success} />}
      {error && <Notice type="error" message={error} />}

      <Section title="Paso 2: Se le asignara a">
        <div className="grid gap-3 md:grid-cols-4">
          {allowedAssignments.map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() => {
                form.setValue("tipoAsignacion", item.value);
                if (item.value !== "Usuario") form.setValue("idUsuario", null);
              }}
              className={`rounded-2xl border p-4 text-left transition hover:border-[#0057B8] hover:shadow-soft ${tipoAsignacion === item.value ? "border-[#0057B8] bg-[#F5F8FF] ring-2 ring-[#0057B8]/20" : "bg-background"}`}
            >
              <p className="font-semibold">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Paso 3: Dimension operacional">
        <SelectField label="Pais" value={pais} onChange={(value) => { form.setValue("pais", value); form.setValue("area", ""); form.setValue("idDimension", 0); }} options={paises.map(toOption)} />
        <SelectField label="Area" value={area} onChange={(value) => { form.setValue("area", value); form.setValue("idDimension", 0); }} options={areas.map(toOption)} />
        <SelectField
          label="SubArea"
          value={String(form.watch("idDimension") || "")}
          onChange={(value) => form.setValue("idDimension", Number(value))}
          options={subAreas.map((item) => ({ value: String(item.idDimension), label: item.label }))}
          helperText="La SubArea representa la dimension operativa final sincronizada desde SAP."
        />
        {showUser && (
          <SmartSelector
            label="Usuario asignado"
            options={usuarioOptions}
            value={String(form.watch("idUsuario") ?? "")}
            onChange={(value) => form.setValue("idUsuario", value ? Number(value) : null)}
            allowAdd={false}
            helperText="Busca por nombre, apellidos, RUT, correo o cargo."
          />
        )}
      </Section>

      <Section title={`Datos del activo: ${selectedType}`}>
        {showBrandModel && (
          <>
            <SmartSelector label="Marca" options={marcaOptions} value={String(form.watch("idMarca") || "")} onChange={(value) => setOption(form, marcaOptions, value, "idMarca", "marca")} onAdd={addMarca} />
            <SmartSelector label="Modelo" options={modeloOptions} value={String(form.watch("idModelo") || "")} onChange={(value) => setOption(form, modeloOptions, value, "idModelo", "modelo")} onAdd={addModelo} />
          </>
        )}
        {isChip && (
          <SelectField label="Compania" value={form.watch("marca") ?? ""} onChange={(value) => form.setValue("marca", value)} options={chipCompanies.map(toOption)} />
        )}
        {showTechnical && (
          <>
            <Field label="RAM (GB)" type="number" {...form.register("ram")} />
            <SmartSelector label="Procesador" options={procesadorOptions} value={String(form.watch("idProcesador") ?? "")} onChange={(value) => setOption(form, procesadorOptions, value, "idProcesador", "procesador")} onAdd={addProcesador} />
          </>
        )}
        {showStorage && (
          <>
            <SelectField label="TipoDisco" value={form.watch("tipoDisco") ?? "SSD"} onChange={(value) => form.setValue("tipoDisco", value)} options={diskTypes.map(toOption)} />
            <SelectField label="CapacidadDisco" value={form.watch("capacidadDisco") ?? "512GB"} onChange={(value) => form.setValue("capacidadDisco", value)} options={diskCapacities.map(toOption)} />
          </>
        )}
        <Field label="Serial" {...form.register("serial")} />
        {!isChip && <Field label="Rut Proveedor" {...form.register("rutProveedor")} />}
        <Field label="Numero Factura" {...form.register("numeroFactura")} />
        <Field label="Fecha Compra" type="date" {...form.register("fechaCompra")} />
        <SmartSelector label="Estado Activo" options={estadoOptions} value={String(form.watch("idEstadoActivo") || "")} onChange={(value) => setOption(form, estadoOptions, value, "idEstadoActivo", "estadoActivo")} onAdd={addEstado} />
        <label className="space-y-2 text-sm font-medium md:col-span-2">
          Detalles
          <textarea className="min-h-28 w-full rounded-2xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" {...form.register("detalles")} />
        </label>
      </Section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button disabled={form.formState.isSubmitting || createActivo.isPending}>{form.formState.isSubmitting || createActivo.isPending ? "Guardando..." : "Guardar activo"}</Button>
      </div>
    </form>
  );

  async function addMarca(label: string) {
    const created = await catalogosService.marcas.create(label);
    await queryClient.invalidateQueries({ queryKey: ["catalogos", "marcas"] });
    return { value: String(getId(created, "idMarca", "IdMarca")), label: getText(created, "nombreMarca", "NombreMarca") || label };
  }

  async function addModelo(label: string) {
    const created = await catalogosService.modelos.create(label, form.getValues("idMarca"));
    await queryClient.invalidateQueries({ queryKey: ["catalogos", "modelos"] });
    return { value: String(getId(created, "idModelo", "IdModelo")), label: getText(created, "nombreModelo", "NombreModelo") || label };
  }

  async function addProcesador(label: string) {
    const created = await catalogosService.procesadores.create(label);
    await queryClient.invalidateQueries({ queryKey: ["catalogos", "procesadores"] });
    return { value: String(getId(created, "idProcesador", "IdProcesador")), label: getText(created, "nombreProcesador", "NombreProcesador") || label };
  }

  async function addEstado(label: string) {
    const created = await catalogosService.estadosActivo.create(label);
    await queryClient.invalidateQueries({ queryKey: ["catalogos", "estados-activo"] });
    return { value: String(getId(created, "idEstadoActivo", "IdEstadoActivo")), label: getText(created, "nombreEstado", "NombreEstado") || label };
  }
}

function normalizeDimension(item: Dimension) {
  const nombre = item.nombreDimension ?? item.NombreDimension ?? "";
  const inferred = inferDimension(nombre);
  return {
    idDimension: item.idDimension ?? item.IdDimension ?? 0,
    pais: item.pais ?? item.Pais ?? inferred.pais,
    area: item.area ?? item.Area ?? inferred.area,
    subArea: item.subArea ?? item.SubArea ?? nombre,
    label: `${item.numeroDimension ?? item.NumeroDimension} - ${item.subArea ?? item.SubArea ?? nombre}`,
  };
}

function inferDimension(nombre: string) {
  if (/peru|trebol/i.test(nombre)) return { pais: "Peru", area: "Retail" };
  if (/bodega|logistica/i.test(nombre)) return { pais: "Chile", area: "Logistica" };
  if (/contabilidad|finanzas/i.test(nombre)) return { pais: "Chile", area: "Finanzas" };
  if (/tienda|mega/i.test(nombre)) return { pais: "Chile", area: "Retail" };
  return { pais: "Chile", area: "TI" };
}

function toUsuarioOption(user: UsuarioApi): SmartSelectorOption {
  const id = user.idUsuario ?? user.IdUsuario ?? 0;
  const nombre = user.nombreUsuario ?? user.NombreUsuario ?? "";
  const paterno = user.apellidoPaterno ?? user.ApellidoPaterno ?? "";
  const materno = user.apellidoMaterno ?? user.ApellidoMaterno ?? "";
  const rut = user.rut ?? user.Rut ?? "";
  const correo = user.correoCorporativo ?? user.CorreoCorporativo ?? "";
  const cargo = getCargo(user);
  return {
    value: String(id),
    label: `${nombre} ${paterno} ${materno}`.trim() + ` - ${cargo}${rut ? ` (${rut})` : ""}${correo ? ` ${correo}` : ""}`,
  };
}

function getCargo(user: UsuarioApi) {
  const cargo = user.cargo ?? user.Cargo;
  if (typeof cargo === "string") return cargo || "Sin cargo";
  return user.cargoNombre ?? user.CargoNombre ?? cargo?.nombreRol ?? cargo?.NombreRol ?? user.rol?.nombreRol ?? user.Rol?.NombreRol ?? "Sin cargo";
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function toOption(value: string) {
  return { value, label: value };
}

function parseCapacity(value: string) {
  const numeric = Number.parseInt(value.replace(/\D/g, ""), 10);
  return value.toUpperCase().includes("TB") ? numeric * 1024 : numeric;
}

function applyFirst(options: SmartSelectorOption[], apply: (option: SmartSelectorOption) => void) {
  if (options.length) apply(options[0]);
}

function setOption(form: ReturnType<typeof useForm<FormData>>, options: SmartSelectorOption[], value: string, idField: keyof FormData, labelField: keyof FormData) {
  const option = options.find((item) => item.value === value);
  form.setValue(idField, Number(value) as never);
  form.setValue(labelField, (option?.label ?? "") as never);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-blue-100 shadow-soft">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="space-y-2 text-sm font-medium">
      {label}
      <Input {...props} />
    </label>
  );
}

function SelectField({ label, value, onChange, options, helperText }: { label: string; value: string; onChange: (value: string) => void; options: SmartSelectorOption[]; helperText?: string }) {
  return (
    <label className="space-y-2 text-sm font-medium">
      {label}
      <select className="h-10 w-full rounded-2xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="" disabled>Seleccionar</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </label>
  );
}

function Notice({ type, message }: { type: "success" | "error"; message: string }) {
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div className={type === "success" ? "flex gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700" : "flex gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"}>
      <Icon className="h-5 w-5" />
      {message}
    </div>
  );
}
