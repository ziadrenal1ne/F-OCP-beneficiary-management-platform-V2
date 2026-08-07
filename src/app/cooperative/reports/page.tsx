import { getSession } from "@/lib/auth";
import { getCooperativeById, monthLabel } from "@/lib/data";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportSubmitDialog } from "@/components/forms/report-submit-dialog";
import { FileCheck2, MessageSquare } from "lucide-react";

const STATUS_LABEL: Record<string, string> = { APPROVED: "Approuvé", SUBMITTED: "En attente", REJECTED: "Rejeté", DRAFT: "Brouillon" };
const STATUS_VARIANT: Record<string, any> = { APPROVED: "success", SUBMITTED: "warning", REJECTED: "destructive", DRAFT: "secondary" };

export default async function CooperativeReportsPage() {
  const session = await getSession();
  if (!session?.cooperativeId) redirect("/login");
  const coop = await getCooperativeById(session.cooperativeId);
  if (!coop) redirect("/login");

  const now = new Date();
  const alreadySubmittedThisMonth = coop.reports.some((r) => r.month === now.getMonth() + 1 && r.year === now.getFullYear());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Rapports mensuels</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Soumettez vos rapports d'activité et suivez leur validation.</p>
        </div>
        <ReportSubmitDialog />
      </div>

      {alreadySubmittedThisMonth && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          Le rapport de ce mois-ci a déjà été soumis. Vous pouvez le resoumettre si nécessaire depuis le bouton ci-dessus.
        </div>
      )}

      <div className="space-y-3">
        {coop.reports.length === 0 && (
          <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Aucun rapport soumis pour le moment.</CardContent></Card>
        )}
        {coop.reports.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><FileCheck2 className="h-4 w-4" /></div>
                <div>
                  <CardTitle className="text-base">{monthLabel(r.month, r.year)}</CardTitle>
                  <CardDescription>{r.beneficiariesReached} bénéficiaires touchés</CardDescription>
                </div>
              </div>
              <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><span className="font-medium">Activités : </span><span className="text-muted-foreground">{r.activitySummary}</span></p>
              <p><span className="font-medium">Réalisations : </span><span className="text-muted-foreground">{r.achievements}</span></p>
              <p><span className="font-medium">Défis : </span><span className="text-muted-foreground">{r.challenges}</span></p>
              {r.reviewComment && (
                <div className="flex items-start gap-2 rounded-lg bg-muted p-3">
                  <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{r.reviewComment}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
