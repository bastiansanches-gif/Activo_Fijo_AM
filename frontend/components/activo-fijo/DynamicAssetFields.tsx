"use client";

import { Input } from "@/components/ui/input";

const computational = ["Notebook", "AIO", "MacBook", "iMac"];

export function DynamicAssetFields({ categoria }: { categoria: string }) {
  if (computational.includes(categoria)) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {["Nombre equipo", "Dominio", "RAM", "Procesador", "Almacenamiento", "Sistema operativo", "IP eth0", "Serie cargador", "Serie bateria"].map((label) => (
          <label key={label} className="space-y-2 text-sm font-medium">
            {label}
            <Input name={`tech.${label}`} />
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" name="tech.meraki" /> Meraki</label>
        <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" name="tech.antivirus" /> Antivirus</label>
      </div>
    );
  }

  if (categoria === "Chip BKP") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {["PIN", "PUK", "Tienda"].map((label) => (
          <label key={label} className="space-y-2 text-sm font-medium">
            {label}
            <Input name={`chip.${label}`} />
          </label>
        ))}
      </div>
    );
  }

  return <p className="text-sm text-muted-foreground">Seleccione una categoria computacional o Chip BKP para ver campos especificos.</p>;
}
