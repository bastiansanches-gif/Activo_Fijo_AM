"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: TabsPrimitive.TabsListProps) {
  return <TabsPrimitive.List className={cn("inline-flex h-10 items-center rounded-2xl bg-secondary p-1", className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn("rounded-xl px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm", className)}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;
