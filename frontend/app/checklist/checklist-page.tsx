"use client";

import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { checklistService } from "@/services/checklistService";

export default function ChecklistPage() {
  const { data = [], isLoading, error } = useQuery({ queryKey: ["checklist"], queryFn: checklistService.list });

  return (
    <RoleGuard roles={["ADMIN", "NORMAL"]}>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-normal">Checklist</h2>
        <Card className="asset-glow">
          <CardHeader><CardTitle>Plantillas disponibles</CardTitle></CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Cargando plantillas...</p>}
            {error && <p className="text-sm text-destructive">No se pudo listar checklist.</p>}
            <Table>
              <TableHeader>
                <TableRow><TableHead>Nombre</TableHead><TableHead>Tipo</TableHead><TableHead>Archivo</TableHead><TableHead>Descarga</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.idChecklist}>
                    <TableCell className="font-medium">{item.nombreChecklist}</TableCell>
                    <TableCell>{item.tipoChecklist}</TableCell>
                    <TableCell>{item.nombreArchivo}</TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <a href={checklistService.downloadUrl(item.idChecklist)}><Download className="h-4 w-4" /> Descargar</a>
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
