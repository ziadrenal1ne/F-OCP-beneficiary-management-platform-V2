import { Badge } from "@/components/ui/badge";

const MAP: Record<string, { label: string; variant: "success" | "warning" | "danger" | "muted" | "default" | "secondary" }> = {
  active: { label: "Active", variant: "success" },
  pending: { label: "En attente", variant: "warning" },
  suspended: { label: "Suspendue", variant: "muted" },
  draft: { label: "Brouillon", variant: "muted" },
  submitted: { label: "Soumis", variant: "warning" },
  approved: { label: "Approuvé", variant: "success" },
  rejected: { label: "Rejeté", variant: "danger" },
  expiring: { label: "Expire bientôt", variant: "warning" },
  expired: { label: "Expirée", variant: "danger" },
};

export function StatusBadge({ value }: { value: string }) {
  const item = MAP[value] ?? { label: value, variant: "secondary" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
