import { db } from "@/db";
import { conventions, cooperatives } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText } from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = { ACTIVE: "Active", EXPIRING: "Expire bientôt", EXPIRED: "Expirée", DRAFT: "Brouillon" };
const STATUS_VARIANT: Record<string, any> = { ACTIVE: "success", EXPIRING: "warning", EXPIRED: "destructive", DRAFT: "secondary" };

export default async function AdminConventionsPage() {
  const rows = await db
    .select().from(conventions)
    .innerJoin(cooperatives, eq(conventions.cooperativeId, cooperatives.id))
    .orderBy(desc(conventions.startDate));

  const all = rows.map((r) => ({ ...r.conventions, cooperativeName: r.cooperatives.name }));
  const totalBudget = all.reduce((sum, c) => sum + c.budget, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Conventions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{all.length} convention(s) — budget cumulé {totalBudget.toLocaleString("fr-FR")} MAD</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted"><ScrollText className="h-4 w-4" /></div>
              <Badge variant={STATUS_VARIANT[c.status]}>{STATUS_LABEL[c.status]}</Badge>
            </div>
            <p className="mt-3 text-sm font-medium leading-tight">{c.title}</p>
            <Link href={`/admin/cooperatives/${c.cooperativeId}`} className="mt-0.5 text-xs text-muted-foreground hover:underline block">
              {c.cooperativeName}
            </Link>
            <p className="mt-2 text-xs text-muted-foreground">Réf. {c.reference}</p>
            <p className="mt-1 font-mono text-sm font-semibold">{c.budget.toLocaleString("fr-FR")} MAD</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(c.startDate).toLocaleDateString("fr-FR")} → {new Date(c.endDate).toLocaleDateString("fr-FR")}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
