import type { LucideIcon } from "lucide-react";
import { BentoCard } from "./BentoCard";

export function StatsCard({ title, value, detail, icon: Icon }: { title: string; value: string | number; detail: string; icon: LucideIcon }) {
  return (
    <BentoCard>
      <div className="flex h-full min-h-36 flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="rounded-2xl bg-secondary p-2">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-normal">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
        </div>
      </div>
    </BentoCard>
  );
}
