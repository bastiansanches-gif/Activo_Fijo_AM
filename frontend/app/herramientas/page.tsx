"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Hammer, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { herramientasService } from "@/services/herramientasService";

export default function HerramientasPage() {
  const queryClient = useQueryClient();
  const [nombre, setNombre] = useState("");
  const { data = [], isLoading, error } = useQuery({ queryKey: ["herramientas"], queryFn: herramientasService.list });
  const create = useMutation({
    mutationFn: () => herramientasService.create({ nombreHerramienta: nombre, tipoHerramienta: "Manual", cantidad: 1, estado: "Disponible", activo: true }),
    onSuccess: () => {
      setNombre("");
      queryClient.invalidateQueries({ queryKey: ["herramientas"] });
    },
  });
  const remove = useMutation({
    mutationFn: herramientasService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["herramientas"] }),
  });

  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Herramientas</h2>
          <p className="text-muted-foreground">Inventario operativo independiente de activo fijo contable.</p>
        </div>
        <Card className="asset-glow">
          <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2"><Hammer className="h-5 w-5" /> Herramientas utilizables</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Nueva herramienta" value={nombre} onChange={(event) => setNombre(event.target.value)} />
              <Button disabled={!nombre || create.isPending} onClick={() => create.mutate()}><Plus className="h-4 w-4" /> Crear</Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Cargando herramientas...</p>}
            {error && <p className="text-sm text-destructive">No se pudo conectar con herramientas.</p>}
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
                {data.map((item) => (
                  <TableRow key={item.idHerramienta}>
                    <TableCell className="font-medium">{item.nombreHerramienta}</TableCell>
                    <TableCell>{item.tipoHerramienta}</TableCell>
                    <TableCell>{item.marca ?? "-"}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>{item.idDimension ?? "Sin dimension"}</TableCell>
                    <TableCell><Badge variant={item.estado === "Disponible" ? "success" : "secondary"}>{item.estado}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => remove.mutate(item.idHerramienta)} aria-label="Desactivar herramienta">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
