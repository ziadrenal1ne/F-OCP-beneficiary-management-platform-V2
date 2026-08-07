import { db } from "@/db";
import { reports, cooperatives } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { monthLabel } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { reviewReport } from "@/app/actions/coop";
import { Check, X, FileText } from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = { DRAFT: "Brouillon", SUBMITTED: "Soumis", APPROVED: "Approuvé", REJECTED: "Rejeté" };
const STATUS_VARIANT: Record<string, any> = { DRAFT: "secondary", SUBMITTED: "warning", APPROVED: "success", REJECTED: "destructive" };

export default async function AdminReportsPage() {
  const rows = await db
    .select().from(reports)
    .innerJoin(cooperatives, eq(reports.cooperativeId, cooperatives.id))
    .orderBy(desc(reports.submittedAt));

  const all = rows.map((r) => ({ ...r.reports, cooperativeName: r.cooperatives.name, cooperativeCity: r.cooperatives.city }));
  const pending = all.filter((r) => r.status === "SUBMITTED");
  const reviewed = all.filter((r) => r.status !== "SUBMITTED");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Rapports mensuels</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Validation des rapports d'activité soumis par les coopératives</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">En attente ({pending.length})</TabsTrigger>
          <TabsTrigger value="reviewed">Traités ({reviewed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3">
          {pending.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">Aucun rapport en attente de validation.</p>}
          {pending.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground"><FileText className="h-4 w-4" /></div>
                  <div>
                    <Link href={`/admin/cooperatives/${r.cooperativeId}`} className="text-sm font-medium hover:underline">{r.cooperativeName}</Link>
                    <p className="text-xs text-muted-foreground">{r.cooperativeCity} · {monthLabel(r.month, r.year)}</p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-2xl">{r.activitySummary}</p>
                    <div className="mt-2 grid gap-1 sm:grid-cols-2 text-xs">
                      <p><span className="text-muted-foreground">Réalisations :</span> {r.achievements}</p>
                      <p><span className="text-muted-foreground">Défis :</span> {r.challenges}</p>
                    </div>
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
              </div>
              <form action={reviewReport} className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                <input type="hidden" name="reportId" value={r.id} />
                <input
                  name="comment"
                  placeholder="Commentaire (optionnel)"
                  className="h-8 flex-1 min-w-[200px] rounded-md border border-input bg-background px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                />
                <Button type="submit" name="decision" value="APPROVED" size="sm" variant="outline" className="text-success border-success/40 hover:bg-success/10">
                  <Check className="h-3.5 w-3.5" /> Approuver
                </Button>
                <Button type="submit" name="decision" value="REJECTED" size="sm" variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10">
                  <X className="h-3.5 w-3.5" /> Rejeter
                </Button>
              </form>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-2">
          {reviewed.map((r) => (
            <Card key={r.id} className="flex items-center justify-between gap-3 p-3.5">
              <div>
                <Link href={`/admin/cooperatives/${r.cooperativeId}`} className="text-sm font-medium hover:underline">{r.cooperativeName}</Link>
                <p className="text-xs text-muted-foreground">{monthLabel(r.month, r.year)}</p>
              </div>
              <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
