import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-2xl font-medium tabular-nums tracking-tight sm:text-3xl">
            {formatNumber(value)}
          </p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </Card>
  );
}
