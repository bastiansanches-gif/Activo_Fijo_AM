"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type SmartSelectorOption = {
  value: string;
  label: string;
};

type SmartSelectorProps = {
  label: string;
  options: SmartSelectorOption[];
  value?: string;
  onChange?: (value: string) => void;
  onAdd?: (label: string) => Promise<SmartSelectorOption> | SmartSelectorOption;
  allowAdd?: boolean;
  addLabel?: string;
  helperText?: string;
};

export function SmartSelector({ label, options, value, onChange, onAdd, allowAdd = Boolean(onAdd), addLabel = "+ Agregar otro", helperText }: SmartSelectorProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(options);
  const [open, setOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(options);
  }, [options]);

  const filtered = useMemo(
    () => items.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  async function handleAdd() {
    if (!newValue.trim()) return;
    setSaving(true);
    setError("");
    try {
      const option = onAdd ? await onAdd(newValue.trim()) : { value: `${Date.now()}`, label: newValue.trim() };
      setItems((current) => [option, ...current]);
      onChange?.(option.value);
      setNewValue("");
      setOpen(false);
    } catch {
      setError("No se pudo guardar el nuevo valor.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="rounded-[1.25rem] border bg-background p-2 shadow-sm">
        <div className="flex items-center gap-2 border-b pb-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="h-8 flex-1 bg-transparent text-sm outline-none"
            placeholder="Buscar..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {allowAdd && (
            <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Agregar nuevo">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="mt-2 max-h-40 space-y-1 overflow-auto">
          {filtered.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => onChange?.(option.value)}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-secondary ${value === option.value ? "bg-secondary font-medium" : ""}`}
            >
              {option.label}
            </button>
          ))}
          {allowAdd && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full rounded-xl border border-dashed border-[#0057B8]/40 px-3 py-2 text-left text-sm font-medium text-[#0057B8] transition hover:bg-[#F5F8FF]"
            >
              {addLabel}
            </button>
          )}
          {!filtered.length && <p className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</p>}
        </div>
      </div>
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar otro</DialogTitle>
            <DialogDescription>El valor se guardara en backend y quedara disponible en el selector.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={newValue} onChange={(event) => setNewValue(event.target.value)} placeholder={label} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="button" onClick={handleAdd} className="w-full" disabled={saving || !newValue.trim()}>
              {saving ? "Guardando..." : "Agregar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
