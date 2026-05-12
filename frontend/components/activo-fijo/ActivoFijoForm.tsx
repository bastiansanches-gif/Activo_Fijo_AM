"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicAssetFields } from "./DynamicAssetFields";
import { SmartSelector, type SmartSelectorOption } from "@/components/selectors/SmartSelector";
import { activoFijoService } from "@/services/activo-fijo-service";
import { maestrosService } from "@/services/maestros-service";
import { categorias, canales, centrosCosto, marcas, tiendas } from "@/mocks/maestros";
import { mockUsuarios } from "@/mocks/usuarios";

const schema = z.object({
  serieActivo: z.string().min(2),
  sku: z.string().min(1),
  codSAP: z.string().min(1),
  nomActivo: z.string().min(2),
  categoriaActivo: z.string().min(1),
  marca: z.string().min(1),
  modelo: z.string().min(1),
  estadoActivo: z.enum(["Disponible", "Asignado", "En tienda", "Baja", "Revision"]),
  codEmpleado: z.string().optional(),
  codCC: z.string().min(1),
  codCanal: z.string().min(1),
  idTienda: z.string().min(1),
  ubicacionTexto: z.string().min(1),
  fechaCompra: z.string().min(1),
  numeroFactura: z.string().min(1),
  proveedorNombre: z.string().min(1),
  precioCompra: z.coerce.number().min(0),
  detalles: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const toOptions = (items: Array<{ id: string; nombre: string }>): SmartSelectorOption[] => items.map((item) => ({ value: item.nombre, label: item.nombre }));
const toCodeOptions = (items: Array<{ id: string; codigo: string; nombre: string }>): SmartSelectorOption[] =>
  items.map((item) => ({ value: item.codigo, label: `${item.codigo} - ${item.nombre}` }));

export function ActivoFijoForm() {
  const router = useRouter();
  const [categoria, setCategoria] = useState("Notebook");
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serieActivo: "",
      sku: "",
      codSAP: "",
      nomActivo: "",
      categoriaActivo: "Notebook",
      marca: "Lenovo",
      modelo: "",
      estadoActivo: "Disponible",
      codEmpleado: "",
      codCC: "CC-TI",
      codCanal: "RET",
      idTienda: "T001",
      ubicacionTexto: "",
      fechaCompra: new Date().toISOString().slice(0, 10),
      numeroFactura: "",
      proveedorNombre: "",
      precioCompra: 0,
      detalles: "",
    },
  });

  async function addMaster(label: string): Promise<SmartSelectorOption> {
    const option = await maestrosService.add("categorias", label);
    return { value: option.nombre, label: option.nombre };
  }

  async function onSubmit(values: FormData) {
    await activoFijoService.create({
      ...values,
      codEmpleado: values.codEmpleado ?? "",
      detalles: values.detalles ?? "",
      codUsuarioIngreso: "ADM001",
      codUsuarioModifica: "ADM001",
      esSerializado: true,
      activo: true,
    });
    router.push("/activo-fijo");
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <Tabs defaultValue="general">
        <TabsList className="mb-4 flex w-full overflow-x-auto md:w-fit">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="asignacion">Asignacion</TabsTrigger>
          <TabsTrigger value="compra">Compra</TabsTrigger>
          <TabsTrigger value="tecnico">Tecnico</TabsTrigger>
          <TabsTrigger value="observaciones">Observaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Section title="Informacion general">
            <Field label="Serie Activo" {...form.register("serieActivo")} />
            <Field label="SKU" {...form.register("sku")} />
            <Field label="Codigo SAP" {...form.register("codSAP")} />
            <Field label="Nombre Activo" {...form.register("nomActivo")} />
            <SmartSelector
              label="Categoria"
              options={toOptions(categorias)}
              value={categoria}
              onChange={(value) => {
                setCategoria(value);
                form.setValue("categoriaActivo", value);
              }}
              onAdd={addMaster}
            />
            <SmartSelector label="Marca" options={toOptions(marcas)} value={form.watch("marca")} onChange={(value) => form.setValue("marca", value)} />
            <Field label="Modelo" {...form.register("modelo")} />
            <label className="space-y-2 text-sm font-medium">
              Estado
              <select className="h-10 w-full rounded-2xl border bg-background px-3 text-sm" {...form.register("estadoActivo")}>
                {["Disponible", "Asignado", "En tienda", "Revision", "Baja"].map((estado) => <option key={estado}>{estado}</option>)}
              </select>
            </label>
          </Section>
        </TabsContent>
        <TabsContent value="asignacion">
          <Section title="Asignacion">
            <SmartSelector label="Empleado" options={mockUsuarios.map((u) => ({ value: u.codUsuario, label: `${u.codUsuario} - ${u.nomUsuario}` }))} value={form.watch("codEmpleado")} onChange={(value) => form.setValue("codEmpleado", value)} />
            <SmartSelector label="CentroCosto" options={toCodeOptions(centrosCosto)} value={form.watch("codCC")} onChange={(value) => form.setValue("codCC", value)} />
            <SmartSelector label="Canal" options={toCodeOptions(canales)} value={form.watch("codCanal")} onChange={(value) => form.setValue("codCanal", value)} />
            <SmartSelector label="Tienda" options={tiendas.map((t) => ({ value: t.codigo, label: `${t.codigo} - ${t.nombre}` }))} value={form.watch("idTienda")} onChange={(value) => form.setValue("idTienda", value)} />
            <Field label="Ubicacion" {...form.register("ubicacionTexto")} />
          </Section>
        </TabsContent>
        <TabsContent value="compra">
          <Section title="Compra">
            <Field label="Fecha compra" type="date" {...form.register("fechaCompra")} />
            <Field label="Numero factura" {...form.register("numeroFactura")} />
            <Field label="Proveedor" {...form.register("proveedorNombre")} />
            <Field label="Precio compra" type="number" {...form.register("precioCompra")} />
          </Section>
        </TabsContent>
        <TabsContent value="tecnico">
          <Section title="Detalle tecnico dinamico">
            <div className="md:col-span-2">
              <DynamicAssetFields categoria={categoria} />
            </div>
          </Section>
        </TabsContent>
        <TabsContent value="observaciones">
          <Section title="Observaciones">
            <label className="space-y-2 text-sm font-medium md:col-span-2">
              Detalles
              <textarea className="min-h-32 w-full rounded-2xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" {...form.register("detalles")} />
            </label>
          </Section>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Guardando..." : "Guardar activo"}</Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
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
