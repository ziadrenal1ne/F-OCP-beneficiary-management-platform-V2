import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getReport, reviewReport } from "@/lib/server/api";
import { formatMonth, formatNumber } from "@/lib/utils";
import { useActor } from "@/hooks/use-actor";
import type { Report } from "@/lib/types";

export const Route = createFileRoute("/_app/rapports/$id")({ component: ReportDetailPage });

function ReportDetailPage() {
  const { id } = Route.useParams();
  const reportId = Number(id);
  const { actor } = useActor();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    void getReport({ data: { id: reportId } }).then(setReport);
  }, [reportId]);

  if (!report) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  async function decide(decision: "approved" | "rejected") {
    try {
      await reviewReport({ data: { id: reportId, decision, comment } });
      toast.success(decision === "approved" ? "Rapport approuvé" : "Rapport rejeté");
      void navigate({ to: "/rapports" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action impossible");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow={report.cooperativeName}
        title={report.title}
        description={formatMonth(report.year, report.month)}
        actions={<StatusBadge value={report.status} />}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2 space-y-4">
          <Block title="Synthèse d'activité" body={report.activitySummary} />
          <Block title="Réalisations" body={report.achievements} />
          <Block title="Difficultés" body={report.challenges} />
          <Block title="Actions à venir" body={report.futureActions} />
          {report.reviewComment ? <Block title="Commentaire de revue" body={report.reviewComment} /> : null}
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Bénéficiaires déclarés</p>
            <dl className="mt-3 space-y-2 text-sm">
              <Row k="Femmes" v={report.women} />
              <Row k="Hommes" v={report.men} />
              <Row k="Jeunes" v={report.youth} />
              <Row k="Adultes" v={report.adults} />
              <Row k="Enfants" v={report.children} />
              <Row k="Handicap" v={report.disabled} />
              <Row k="Indirects" v={report.indirect} />
            </dl>
          </Card>
          {actor?.role === "admin" && report.status === "submitted" ? (
            <Card className="p-5 space-y-3">
              <Label>Commentaire de validation</Label>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Motif, recommandations…" />
              <div className="flex gap-2">
                <Button onClick={() => void decide("approved")}>Approuver</Button>
                <Button variant="destructive" onClick={() => void decide("rejected")}>Rejeter</Button>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body || "—"}</p>
    </section>
  );
}
function Row({ k, v }: { k: string; v: number }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="tabular-nums">{formatNumber(v)}</dd>
    </div>
  );
}
