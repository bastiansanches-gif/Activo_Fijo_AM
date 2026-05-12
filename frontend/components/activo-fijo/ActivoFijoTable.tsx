"use client";

import Link from "next/link";
import { Eye, Plus, Search } from "lucide-react";
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
  "En tienda": "warning",
  Baja: "destructive",
  Revision: "warning",
};

export function ActivoFijoTable({ activos }: { activos: ActivoFijo[] }) {
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("Todos");

  const filtered = useMemo(
    () =>
      activos.filter((activo) => {
        const matchesQuery = [activo.serieActivo, activo.nomActivo, activo.marca, activo.modelo, activo.codSAP]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesEstado = estado === "Todos" || activo.estadoActivo === estado;
        return matchesQuery && matchesEstado;
      }),
    [activos, estado, query],
  );

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Activo Fijo</CardTitle>
        <Button asChild>
          <Link href="/activo-fijo/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo activo
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar por serie, nombre, marca, modelo o SAP" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <select className="h-10 rounded-2xl border bg-background px-3 text-sm" value={estado} onChange={(event) => setEstado(event.target.value)}>
            {["Todos", "Disponible", "Asignado", "En tienda", "Revision", "Baja"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serie</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Ubicacion</TableHead>
                <TableHead>Codigo SAP</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((activo) => (
                <TableRow key={activo.serieActivo}>
                  <TableCell className="font-medium">{activo.serieActivo}</TableCell>
                  <TableCell>{activo.nomActivo}</TableCell>
                  <TableCell>{activo.categoriaActivo}</TableCell>
                  <TableCell>{activo.marca}</TableCell>
                  <TableCell>{activo.modelo}</TableCell>
                  <TableCell><Badge variant={estadoVariant[activo.estadoActivo]}>{activo.estadoActivo}</Badge></TableCell>
                  <TableCell>{activo.codEmpleado || "Sin asignar"}</TableCell>
                  <TableCell>{activo.ubicacionTexto}</TableCell>
                  <TableCell>{activo.codSAP}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/activo-fijo/${activo.serieActivo}`} aria-label="Ver detalle"><Eye className="h-4 w-4" /></Link>
                    </Button>
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
