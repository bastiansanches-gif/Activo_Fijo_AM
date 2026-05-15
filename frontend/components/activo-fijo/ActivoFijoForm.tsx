"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Search, ShieldCheck, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SmartSelector, type SmartSelectorOption } from "@/components/selectors/SmartSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { activoFijoService } from "@/services/activo-fijo-service";
import { ApiError } from "@/services/apiClient";
import { authService } from "@/services/auth-service";
import { catalogosService, getId, getText } from "@/services/catalogos-service";
import { dimensionesService, type Dimension } from "@/services/dimensionesService";
import { licenciasService, type LicenciaApi } from "@/services/licencias-service";
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

export function ActivoFijoForm({ tipo }: { tipo?: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const session = authService.getSession();
  const selectedSlug = tipo ?? searchParams.get("tipo");
  const selectedType = getAssetTypeName(selectedSlug);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingActivo, setPendingActivo] = useState<{ values: FormData; idDiscoDuro: number | null } | null>(null);

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["activos"] });
      setSuccess("Activo fijo registrado correctamente.");
      setError("");
      setPendingActivo(null);
      setSuccessOpen(true);
      form.reset(getDefaultActivoValues(selectedType, selectedSlug));
      window.setTimeout(() => router.push("/dashboard"), 900);
    },
    onError: (mutationError) => {
      setError(mapActivoError(mutationError));
      setPendingActivo(null);
    },
  });

  if (!selectedSlug || !assetTypes.some((item) => item.slug === selectedSlug)) {
    return <Notice type="error" message="Selecciona primero un tipo de activo desde las cards." />;
  }

  if (!session) {
    return <Notice type="error" message="No existe usuario logueado. Inicia sesion para registrar activos." />;
  }

  if (selectedSlug === "usuario") {
    return <UsuarioAssetForm />;
  }

  async function onSubmit(values: FormData) {
    setError("");
    let idDiscoDuro = values.idDiscoDuro ?? null;
    if (showStorage) {
      idDiscoDuro = await resolveDisco(values.tipoDisco ?? "SSD", values.capacidadDisco ?? "512GB");
    }

    setPendingActivo({ values, idDiscoDuro });
  }

  async function confirmCreateActivo() {
    if (!pendingActivo) return;
    const { values, idDiscoDuro } = pendingActivo;
    await createActivo.mutateAsync({
      idDimension: values.idDimension,
      idUsuario: showUser ? values.idUsuario ?? null : null,
      ram: showTechnical ? values.ram ?? null : null,
      idMarca: values.idMarca ?? 1,
      idModelo: values.idModelo ?? 1,
      idProcesador: showTechnical ? values.idProcesador ?? null : null,
      idDiscoDuro: idDiscoDuro,
      serial: values.serial,
      numeroFactura: values.numeroFactura ?? "",
      rutProveedor: values.rutProveedor ?? "",
      fechaCompra: values.fechaCompra ? new Date(values.fechaCompra).toISOString() : new Date().toISOString(),
      detalles: values.detalles ?? null,
      idEstadoActivo: values.idEstadoActivo,
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
            helperText="Busca por nombre, apellidos, RUT, correo o rol."
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

      <Dialog open={!!pendingActivo} onOpenChange={(open) => !open && !createActivo.isPending && setPendingActivo(null)}>
        <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto sm:w-1/2 sm:min-w-[32rem]">
          <DialogHeader>
            <DialogTitle>Confirmar registro</DialogTitle>
          </DialogHeader>
          {pendingActivo && (
            <SummaryList
              rows={[
                ["Tipo de activo", pendingActivo.values.tipoActivo],
                ["Dimension", getDimensionLabelById(normalizedDimensions, pendingActivo.values.idDimension)],
                ["Usuario asignado", showUser && pendingActivo.values.idUsuario ? getUsuarioLabelById(usuarios.data ?? [], pendingActivo.values.idUsuario) : "Sin usuario asignado"],
                ["Marca", showBrandModel ? pendingActivo.values.marca || getOptionLabel(marcaOptions, pendingActivo.values.idMarca) : pendingActivo.values.marca],
                ["Modelo", showBrandModel ? pendingActivo.values.modelo || getOptionLabel(modeloOptions, pendingActivo.values.idModelo) : "No aplica"],
                ["RAM", showTechnical && pendingActivo.values.ram ? `${pendingActivo.values.ram} GB` : "No aplica"],
                ["Procesador", showTechnical ? pendingActivo.values.procesador || getOptionLabel(procesadorOptions, pendingActivo.values.idProcesador) : "No aplica"],
                ["Disco", showStorage ? `${pendingActivo.values.tipoDisco ?? ""} ${pendingActivo.values.capacidadDisco ?? ""}`.trim() : "No aplica"],
                ["Serial", pendingActivo.values.serial],
                ["Numero factura", pendingActivo.values.numeroFactura || "Sin dato"],
                ["RUT proveedor", pendingActivo.values.rutProveedor || "Sin dato"],
                ["Fecha compra", pendingActivo.values.fechaCompra || "Sin dato"],
                ["Estado", pendingActivo.values.estadoActivo || getOptionLabel(estadoOptions, pendingActivo.values.idEstadoActivo)],
                ["Detalles", pendingActivo.values.detalles || "Sin detalles"],
              ]}
            />
          )}
          <div className="grid gap-3 sm:flex sm:justify-end">
            <Button type="button" variant="outline" className="h-11" disabled={createActivo.isPending} onClick={() => setPendingActivo(null)}>Cancelar</Button>
            <Button type="button" className="h-11" disabled={createActivo.isPending} onClick={confirmCreateActivo}>
              {createActivo.isPending ? "Guardando..." : "Confirmar ingreso"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={(open) => {
        setSuccessOpen(open);
        if (!open) router.push("/dashboard");
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registro completado</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Activo fijo registrado correctamente.</p>
          <div className="flex justify-end">
            <Button type="button" onClick={() => {
              setSuccessOpen(false);
              router.push("/dashboard");
            }}>Aceptar</Button>
          </div>
        </DialogContent>
      </Dialog>
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

function getDefaultActivoValues(selectedType: string, selectedSlug: string | null): FormData {
  return {
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
  };
}

function mapActivoError(error: unknown) {
  if (error instanceof ApiError && error.message.includes("Ya existe un activo fijo registrado con este serial")) {
    return "El serial ingresado ya existe en el sistema.";
  }
  return "No se pudo crear el activo. Revisa los datos e intenta nuevamente.";
}

function mapUsuarioError(error: unknown) {
  if (error instanceof ApiError && error.message.includes("Ya existe un usuario registrado con este RUT")) {
    return "El RUT ingresado ya existe en el sistema.";
  }
  return "No se pudo guardar el usuario. Revisa los datos e intenta nuevamente.";
}

function getOptionLabel(options: SmartSelectorOption[], id?: number | null) {
  return options.find((option) => Number(option.value) === id)?.label ?? "Sin dato";
}

function getDimensionLabelById(dimensions: ReturnType<typeof normalizeDimension>[], id: number) {
  return dimensions.find((dimension) => dimension.idDimension === id)?.label ?? String(id);
}

function getUsuarioLabelById(users: UsuarioApi[], id: number) {
  const usuario = users.find((item) => (item.idUsuario ?? item.IdUsuario) === id);
  return usuario ? formatUsuarioName(usuario) : String(id);
}

function getDimensionLabelFromList(dimensions: Dimension[], id: number) {
  const dimension = dimensions.find((item) => (item.idDimension ?? item.IdDimension) === id);
  return dimension ? formatDimension(dimension) : String(id || "");
}

function getLicenciaNamesByIds(licencias: LicenciaApi[], ids: number[]) {
  return licencias
    .filter((licencia) => ids.includes(getId(licencia, "idCuenta", "IdCuenta")))
    .map(getLicenciaName);
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
  return user.rol?.nombreRol ?? user.Rol?.NombreRol ?? user.Rol?.nombreRol ?? "Sin rol";
}

function UsuarioAssetForm() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedLicencias, setSelectedLicencias] = useState<number[]>([]);
  const [form, setForm] = useState({
    rut: "",
    nombreUsuario: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correoCorporativo: "",
    idDimension: 0,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingUsuario, setPendingUsuario] = useState<{ payload: Partial<UsuarioApi>; licencias: number[]; isUpdate: boolean } | null>(null);

  const usuarios = useQuery({ queryKey: ["usuarios"], queryFn: usuariosService.list });
  const dimensiones = useQuery({ queryKey: ["dimensiones"], queryFn: dimensionesService.list });
  const licencias = useQuery({ queryKey: ["licencias"], queryFn: licenciasService.list });

  const filteredUsuarios = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return usuarios.data ?? [];
    return (usuarios.data ?? []).filter((usuario) =>
      [
        usuario.rut ?? usuario.Rut,
        usuario.nombreUsuario ?? usuario.NombreUsuario,
        usuario.apellidoPaterno ?? usuario.ApellidoPaterno,
        usuario.apellidoMaterno ?? usuario.ApellidoMaterno,
        usuario.correoCorporativo ?? usuario.CorreoCorporativo,
        getCargo(usuario),
        getDimensionName(usuario),
      ]
        .join(" ")
        .toLowerCase()
        .includes(text),
    );
  }, [query, usuarios.data]);

  const saveUsuario = useMutation({
    mutationFn: async (pending: { payload: Partial<UsuarioApi>; licencias: number[]; isUpdate: boolean }) => {
      setError("");
      const saved = pending.isUpdate && selectedId ? await usuariosService.update(selectedId, pending.payload) : await usuariosService.create(pending.payload);
      return saved;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
      ]);
      setSuccess(selectedId ? "Usuario actualizado correctamente." : "Usuario registrado correctamente.");
      resetUsuarioForm();
      setPendingUsuario(null);
      setSuccessOpen(true);
    },
    onError: (mutationError) => {
      setError(mapUsuarioError(mutationError));
      setPendingUsuario(null);
    },
  });

  function selectUsuario(usuario: UsuarioApi) {
    const id = usuario.idUsuario ?? usuario.IdUsuario ?? null;
    setSelectedId(id);
    setSuccess("");
    setError("");
    setForm({
      rut: usuario.rut ?? usuario.Rut ?? "",
      nombreUsuario: usuario.nombreUsuario ?? usuario.NombreUsuario ?? "",
      apellidoPaterno: usuario.apellidoPaterno ?? usuario.ApellidoPaterno ?? "",
      apellidoMaterno: usuario.apellidoMaterno ?? usuario.ApellidoMaterno ?? "",
      correoCorporativo: usuario.correoCorporativo ?? usuario.CorreoCorporativo ?? "",
      idDimension: usuario.idDimension ?? usuario.IdDimension ?? 0,
    });
    setSelectedLicencias(getUsuarioLicenciaIds(usuario));
  }

  function clearForm() {
    setSuccess("");
    setError("");
    resetUsuarioForm();
  }

  function resetUsuarioForm() {
    setSelectedId(null);
    setSelectedLicencias([]);
    setQuery("");
    setForm({
      rut: "",
      nombreUsuario: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      correoCorporativo: "",
      idDimension: 0,
    });
  }

  function prepareUsuarioSubmit() {
    setError("");
    setSuccess("");
    setPendingUsuario({
      isUpdate: !!selectedId,
      licencias: selectedLicencias,
      payload: {
        Rut: form.rut,
        NombreUsuario: form.nombreUsuario,
        ApellidoPaterno: form.apellidoPaterno,
        ApellidoMaterno: form.apellidoMaterno || null,
        CorreoCorporativo: form.correoCorporativo,
        FechaIngreso: new Date().toISOString(),
        FinContrato: null,
        IdRol: 2,
        IdDimension: form.idDimension,
        Activo: true,
        IdCuentas: selectedLicencias,
      },
    });
  }

  function confirmSaveUsuario() {
    if (pendingUsuario) saveUsuario.mutate(pendingUsuario);
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-100 bg-[#F5F8FF] shadow-soft">
        <CardContent className="flex gap-3 p-5 text-sm text-muted-foreground">
          <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-[#0057B8]" />
          Este flujo administra datos del usuario y sus licencias. No registra activo fijo fisico.
        </CardContent>
      </Card>

      {success && <Notice type="success" message={success} />}
      {error && <Notice type="error" message={error} />}

      <Card className="border-blue-100 shadow-soft">
        <CardHeader><CardTitle>Buscar usuario</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por rut, nombre, apellidos, correo, cargo o dimension"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="max-h-64 overflow-auto rounded-2xl border">
            {usuarios.isLoading && <p className="p-4 text-sm text-muted-foreground">Cargando usuarios...</p>}
            {usuarios.error && <p className="p-4 text-sm text-destructive">No se pudo cargar usuarios.</p>}
            {filteredUsuarios.map((usuario) => {
              const id = usuario.idUsuario ?? usuario.IdUsuario ?? 0;
              const active = selectedId === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => selectUsuario(usuario)}
                  className={`grid w-full gap-1 border-b px-4 py-3 text-left text-sm last:border-b-0 hover:bg-secondary ${active ? "bg-secondary" : ""}`}
                >
                  <span className="font-medium">{formatUsuarioName(usuario)}</span>
                  <span className="text-xs text-muted-foreground">
                    {[usuario.rut ?? usuario.Rut, usuario.correoCorporativo ?? usuario.CorreoCorporativo, getCargo(usuario), getDimensionName(usuario)].filter(Boolean).join(" | ")}
                  </span>
                </button>
              );
            })}
            {!usuarios.isLoading && !filteredUsuarios.length && <p className="p-4 text-sm text-muted-foreground">Sin resultados.</p>}
          </div>
          <Button type="button" variant="outline" onClick={clearForm}>Registrar nuevo usuario</Button>
        </CardContent>
      </Card>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          prepareUsuarioSubmit();
        }}
      >
        <Section title={selectedId ? "Actualizar usuario" : "Registrar usuario"}>
          <Field label="Rut" value={form.rut} onChange={(event) => setFormValue(setForm, "rut", event.target.value)} required />
          <Field label="Nombre" value={form.nombreUsuario} onChange={(event) => setFormValue(setForm, "nombreUsuario", event.target.value)} required />
          <Field label="Apellido paterno" value={form.apellidoPaterno} onChange={(event) => setFormValue(setForm, "apellidoPaterno", event.target.value)} required />
          <Field label="Apellido materno" value={form.apellidoMaterno} onChange={(event) => setFormValue(setForm, "apellidoMaterno", event.target.value)} />
          <Field label="Correo corporativo" type="email" value={form.correoCorporativo} onChange={(event) => setFormValue(setForm, "correoCorporativo", event.target.value)} required />
          <label className="space-y-2 text-sm font-medium md:col-span-2">
            Dimension
            <select
              className="h-10 w-full rounded-2xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              value={form.idDimension || ""}
              onChange={(event) => setFormValue(setForm, "idDimension", Number(event.target.value))}
              required
            >
              <option value="" disabled>Seleccionar dimension</option>
              {(dimensiones.data ?? []).map((dimension) => {
                const id = dimension.idDimension ?? dimension.IdDimension ?? 0;
                return <option key={id} value={id}>{formatDimension(dimension)}</option>;
              })}
            </select>
          </label>
        </Section>

        <Card className="border-blue-100 shadow-soft">
          <CardHeader><CardTitle>Licencias</CardTitle></CardHeader>
          <CardContent>
            {licencias.isLoading && <p className="text-sm text-muted-foreground">Cargando licencias...</p>}
            {licencias.error && <p className="text-sm text-destructive">No se pudo cargar licencias.</p>}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(licencias.data ?? []).map((licencia) => {
                const id = getId(licencia, "idCuenta", "IdCuenta");
                const checked = selectedLicencias.includes(id);
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setSelectedLicencias((current) => checked ? current.filter((item) => item !== id) : [...current, id])}
                    className={`rounded-2xl border p-4 text-left text-sm transition hover:border-[#0057B8] ${checked ? "border-[#0057B8] bg-[#F5F8FF] ring-2 ring-[#0057B8]/20" : "bg-background"}`}
                  >
                    <span className="block font-semibold">{getLicenciaName(licencia)}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{checked ? "Seleccionada" : "Sin asignar"}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={clearForm}>Limpiar</Button>
          <Button disabled={saveUsuario.isPending || !form.idDimension}>
            {saveUsuario.isPending ? "Guardando..." : selectedId ? "Actualizar usuario" : "Guardar usuario"}
          </Button>
        </div>
      </form>

      <Dialog open={!!pendingUsuario} onOpenChange={(open) => !open && !saveUsuario.isPending && setPendingUsuario(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirmar registro</DialogTitle>
          </DialogHeader>
          <SummaryList
            rows={[
              ["RUT", form.rut],
              ["Nombre completo", [form.nombreUsuario, form.apellidoPaterno, form.apellidoMaterno].filter(Boolean).join(" ")],
              ["Correo", form.correoCorporativo],
              ["Cargo", "Usuario"],
              ["Dimension", getDimensionLabelFromList(dimensiones.data ?? [], form.idDimension)],
              ["Fecha ingreso", new Date().toISOString().slice(0, 10)],
              ["Fecha termino contrato", "Sin termino"],
              ["Licencias seleccionadas", getLicenciaNamesByIds(licencias.data ?? [], selectedLicencias).join(", ") || "Sin licencias"],
            ]}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={saveUsuario.isPending} onClick={() => setPendingUsuario(null)}>Cancelar</Button>
            <Button type="button" disabled={saveUsuario.isPending} onClick={confirmSaveUsuario}>
              {saveUsuario.isPending ? "Guardando..." : "Confirmar registro"}
            </Button>
          </div>
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
    </div>
  );
}

function getUsuarioLicenciaIds(usuario: UsuarioApi) {
  const value = usuario.cuentas ?? usuario.Cuentas ?? [];
  return value.map((item) => item.idCuenta ?? item.IdCuenta ?? 0).filter(Boolean);
}

function formatUsuarioName(usuario: UsuarioApi) {
  return [
    usuario.nombreUsuario ?? usuario.NombreUsuario,
    usuario.apellidoPaterno ?? usuario.ApellidoPaterno,
    usuario.apellidoMaterno ?? usuario.ApellidoMaterno,
  ].filter(Boolean).join(" ") || "Usuario sin nombre";
}

function getDimensionName(usuario: UsuarioApi) {
  return usuario.dimension?.nombreDimension ?? usuario.Dimension?.NombreDimension ?? usuario.Dimension?.nombreDimension ?? "";
}

function formatDimension(dimension: Dimension) {
  return [
    dimension.numeroDimension ?? dimension.NumeroDimension,
    dimension.nombreDimension ?? dimension.NombreDimension,
  ].filter(Boolean).join(" - ");
}

function getLicenciaName(licencia: LicenciaApi) {
  return licencia.nombreCuenta ?? licencia.NombreCuenta ?? "Cuenta";
}

function setFormValue<T extends Record<string, unknown>, K extends keyof T>(setForm: React.Dispatch<React.SetStateAction<T>>, key: K, value: T[K]) {
  setForm((current) => ({ ...current, [key]: value }));
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

function Notice({ type, message }: { type: "success" | "error"; message: string }) {
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div className={type === "success" ? "flex gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700" : "flex gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"}>
      <Icon className="h-5 w-5" />
      {message}
    </div>
  );
}
