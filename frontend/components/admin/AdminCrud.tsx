"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Row = Record<string, string | boolean | number>;

export function AdminCrud({ title, rows }: { title: string; rows: Row[] }) {
  const [items, setItems] = useState(rows);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const columns = Object.keys(items[0] ?? { codigo: "", nombre: "", activo: true });

  function addItem() {
    if (!name.trim()) return;
    setItems((current) => [{ codigo: `NEW-${Date.now().toString().slice(-4)}`, nombre: name.trim(), activo: true }, ...current]);
    setName("");
    setOpen(false);
  }

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>{title}</CardTitle>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Nuevo</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>{columns.map((column) => <TableHead key={column}>{column}</TableHead>)}</TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={`${title}-${index}`}>
                  {columns.map((column) => <TableCell key={column}>{String(item[column])}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo registro</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre" />
            <Button className="w-full" onClick={addItem}>Guardar mock</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
