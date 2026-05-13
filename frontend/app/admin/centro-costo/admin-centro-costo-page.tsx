"use client";

import { useQuery } from "@tanstack/react-query";
import { DatabaseZap } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dimensionesService } from "@/services/dimensionesService";

export default function AdminCentroCostoPage() {
  const { data = [], isLoading, error } = useQuery({ queryKey: ["dimensiones"], queryFn: dimensionesService.list });

  return (
    <RoleGuard roles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal">Dimensiones SAP</h2>
          <p className="text-muted-foreground">Las dimensiones son sincronizadas desde SAP y no pueden modificarse manualmente.</p>
        </div>

        <Card className="border-blue-100 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseZap className="h-5 w-5 text-[#0057B8]" />
              Dimensiones disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Cargando dimensiones desde backend...</p>}
            {error && <p className="text-sm text-destructive">No se pudo listar dimensiones.</p>}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Numero</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((dimension) => (
                    <TableRow key={dimension.idDimension}>
                      <TableCell>{dimension.idDimension}</TableCell>
                      <TableCell className="font-medium">{dimension.numeroDimension}</TableCell>
                      <TableCell>{dimension.nombreDimension}</TableCell>
                      <TableCell>{dimension.activo ? "Activa" : "Inactiva"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
