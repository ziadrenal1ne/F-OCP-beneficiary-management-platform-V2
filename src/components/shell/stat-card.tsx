import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  label, value, icon: Icon, trend, accent = "primary", suffix,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  accent?: "primary" | "gold" | "success" | "default";
  suffix?: string;
}) {
  const accentClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-gold/15 text-gold-foreground",
    success: "bg-success/10 text-success",
    default: "bg-muted text-foreground",
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", accentClasses[accent])}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        {typeof trend === "number" && (
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
              trend >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}
          >
            {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 font-mono text-2xl font-semibold tabular-nums tracking-tight">
        {value}
        {suffix && <span className="ml-1 text-sm font-normal text-muted-foreground">{suffix}</span>}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}
