import type { LucideIcon } from "lucide-react";
import { BentoCard } from "./BentoCard";
import { cn } from "@/lib/utils";

export function StatsCard({
  title,
  value,
  detail,
  icon: Icon,
  className,
  iconClassName,
}: {
  title: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <BentoCard className={cn("overflow-hidden", className)}>
      <div className="flex h-full min-h-36 flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <div className={cn("rounded-2xl bg-white/70 p-2 shadow-sm", iconClassName)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-normal">{value}</p>
          <p className="mt-1 text-sm opacity-75">{detail}</p>
        </div>
      </div>
    </BentoCard>
  );
}
