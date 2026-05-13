"use client";

import Link from "next/link";
import { Eye, History, Pencil, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ActivoFijo, EstadoActivo } from "@/types/activo-fijo";

const estadoVariant: Record<EstadoActivo, "success" | "warning" | "secondary" | "destructive"> = {
  Disponible: "success",
  Asignado: "secondary",
  "En reparacion": "warning",
  "Dado de baja": "destructive",
  Perdido: "destructive",
  Revision: "warning",
};

export function ActivoFijoTable({ activos }: { activos: ActivoFijo[] }) {
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("Todos");
  const [dimension, setDimension] = useState("Todos");
  const [usuario, setUsuario] = useState("Todos");

  const estados = useMemo(() => ["Todos", ...Array.from(new Set(activos.map((activo) => activo.estadoActivo).filter(Boolean)))], [activos]);
  const dimensiones = useMemo(() => ["Todos", ...Array.from(new Set(activos.map((activo) => activo.dimension ?? String(activo.idDimension)).filter(Boolean)))], [activos]);
  const usuarios = useMemo(() => ["Todos", "Sin asignar", ...Array.from(new Set(activos.map((activo) => activo.usuario ?? (activo.idUsuario ? String(activo.idUsuario) : "")).filter(Boolean)))], [activos]);

  const filtered = useMemo(
    () =>
      activos.filter((activo) => {
        const matchesQuery = [activo.serial, activo.marca, activo.modelo, activo.numeroFactura, activo.rutProveedor]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesEstado = estado === "Todos" || activo.estadoActivo === estado;
        const assetDimension = activo.dimension ?? String(activo.idDimension);
        const assetUsuario = activo.usuario ?? (activo.idUsuario ? String(activo.idUsuario) : "");
        const matchesDimension = dimension === "Todos" || assetDimension === dimension;
        const matchesUsuario = usuario === "Todos" || (usuario === "Sin asignar" ? !activo.idUsuario : assetUsuario === usuario);
        return matchesQuery && matchesEstado && matchesDimension && matchesUsuario;
      }),
    [activos, dimension, estado, query, usuario],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activo Fijo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_repeat(3,180px)]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar por serial, marca, modelo, factura o proveedor" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <select className="h-10 rounded-2xl border bg-background px-3 text-sm" value={estado} onChange={(event) => setEstado(event.target.value)}>
            {estados.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="h-10 rounded-2xl border bg-background px-3 text-sm" value={dimension} onChange={(event) => setDimension(event.target.value)}>
            {dimensiones.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="h-10 rounded-2xl border bg-background px-3 text-sm" value={usuario} onChange={(event) => setUsuario(event.target.value)}>
            {usuarios.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serie</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Dimension</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((activo) => (
                <TableRow key={activo.serial}>
                  <TableCell className="font-medium">{activo.serial}</TableCell>
                  <TableCell>{activo.marca}</TableCell>
                  <TableCell>{activo.modelo}</TableCell>
                  <TableCell>{activo.ram ? `${activo.ram} GB` : "No aplica"}</TableCell>
                  <TableCell><Badge variant={estadoVariant[activo.estadoActivo ?? "Revision"]}>{activo.estadoActivo ?? "Revision"}</Badge></TableCell>
                  <TableCell>{activo.usuario ?? activo.idUsuario ?? "Sin asignar"}</TableCell>
                  <TableCell>{activo.dimension ?? activo.idDimension}</TableCell>
                  <TableCell>{activo.numeroFactura || "Sin factura"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/activo-fijo/${activo.serial}`} aria-label="Ver detalle"><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/activo-fijo/${activo.serial}?modo=editar`} aria-label="Editar activo"><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/activo-fijo/${activo.serial}?tab=historial`} aria-label="Ver historial"><History className="h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
