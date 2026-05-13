"use client";

import { useQuery } from "@tanstack/react-query";
import { Hammer, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { herramientasService } from "@/services/herramientasService";

export default function HerramientasPage() {
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("Todos");
  const { data = [], isLoading, error } = useQuery({ queryKey: ["herramientas"], queryFn: herramientasService.list });

  const estados = useMemo(() => ["Todos", ...Array.from(new Set(data.map((item) => item.estado).filter(Boolean)))], [data]);
  const filtered = useMemo(
    () =>
      data.filter((item) => {
        const matchesQuery = [item.nombreHerramienta, item.tipoHerramienta, item.marca, item.idDimension]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesEstado = estado === "Todos" || item.estado === estado;
        return matchesQuery && matchesEstado;
      }),
    [data, estado, query],
  );

  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Herramientas</h2>
          <p className="text-muted-foreground">Inventario operativo independiente de activo fijo contable.</p>
        </div>
        <Card className="asset-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Hammer className="h-5 w-5" /> Herramientas utilizables</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Cargando herramientas...</p>}
            {error && <p className="text-sm text-destructive">No se pudo conectar con herramientas.</p>}
            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Buscar por nombre, tipo, marca o dimension" value={query} onChange={(event) => setQuery(event.target.value)} />
              </div>
              <label className="relative">
                <SlidersHorizontal className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select className="h-10 w-full rounded-2xl border bg-background pl-9 pr-3 text-sm" value={estado} onChange={(event) => setEstado(event.target.value)}>
                  {estados.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Dimension</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.idHerramienta}>
                    <TableCell className="font-medium">{item.nombreHerramienta}</TableCell>
                    <TableCell>{item.tipoHerramienta}</TableCell>
                    <TableCell>{item.marca ?? "-"}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>{item.idDimension ?? "Sin dimension"}</TableCell>
                    <TableCell><Badge variant={item.estado === "Disponible" ? "success" : "secondary"}>{item.estado}</Badge></TableCell>
                    <TableCell>Edicion controlada</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
