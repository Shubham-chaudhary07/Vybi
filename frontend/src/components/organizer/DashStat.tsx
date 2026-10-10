import type { ReactNode } from "react";

interface DashStatProps {
  icon: ReactNode;
  value: string;
  label: string;
  trend: string;
}

export function DashStat({ icon, value, label, trend }: DashStatProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>
      <div className="mt-5 font-display text-3xl font-black">{value}</div>
      <div className="mt-1 text-sm font-semibold">{label}</div>
      <div className="mt-2 text-xs text-muted-foreground">{trend}</div>
    </div>
  );
}
