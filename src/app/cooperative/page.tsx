import { getSession } from "@/lib/auth";
import { getCooperativeById, monthLabel } from "@/lib/data";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/shell/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvolutionChart } from "@/components/charts/evolution-chart";
import { EsgLineChart } from "@/components/charts/esg-line-chart";
import { Users, FileCheck2, FolderOpen, ScrollText, ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<string, string> = {
  APPROVED: "Approuvé", SUBMITTED: "En attente", REJECTED: "Rejeté", DRAFT: "Brouillon",
};
const STATUS_VARIANT: Record<string, any> = {
  APPROVED: "success", SUBMITTED: "warning", REJECTED: "destructive", DRAFT: "secondary",
};

export default async function CooperativeDashboard() {
  const session = await getSession();
  if (!session?.cooperativeId) redirect("/login");
  const coop = await getCooperativeById(session.cooperativeId);
  if (!coop) redirect("/login");

  const latestBen = coop.beneficiaryHistory[coop.beneficiaryHistory.length - 1];
  const evolutionData = coop.beneficiaryHistory.slice(-8).map((b) => ({
    label: monthLabel(b.month, b.year), women: b.women, men: b.men, total: b.women + b.men,
  }));
  const esgData = coop.esgHistory.map((e) => ({
    label: monthLabel(e.month, e.year), environmental: e.environmental, social: e.social, governance: e.governance,
  }));
  const pendingApproved = coop.reports.filter((r) => r.status === "APPROVED").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{coop.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{coop.city}, {coop.region} · {coop.sector}</p>
        </div>
        <Badge variant={coop.status === "ACTIVE" ? "success" : coop.status === "PENDING" ? "warning" : "destructive"}>
          {coop.status === "ACTIVE" ? "Active" : coop.status === "PENDING" ? "En attente" : "Suspendue"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Bénéficiaires directs" value={((latestBen?.women ?? 0) + (latestBen?.men ?? 0)).toLocaleString("fr-FR")} icon={Users} accent="primary" />
        <StatCard label="Bénéficiaires indirects" value={(latestBen?.indirect ?? 0).toLocaleString("fr-FR")} icon={Users} accent="gold" />
        <StatCard label="Rapports approuvés" value={pendingApproved} icon={FileCheck2} accent="success" />
        <StatCard label="Documents" value={coop.documents.length} icon={FolderOpen} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des bénéficiaires</CardTitle>
            <CardDescription>Femmes et hommes — 8 derniers mois</CardDescription>
          </CardHeader>
          <CardContent><EvolutionChart data={evolutionData} /></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Leaf className="h-4 w-4 text-primary" /> ODD liés</CardTitle>
            <CardDescription>Objectifs de développement durable</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {coop.odds.map((o) => (
              <div key={o.number} className="flex items-center gap-2.5 rounded-lg border p-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white" style={{ background: o.color }}>
                  {o.number}
                </span>
                <span className="text-sm">{o.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs ESG</CardTitle>
            <CardDescription>Environnement, Social, Gouvernance</CardDescription>
          </CardHeader>
          <CardContent><EsgLineChart data={esgData} /></CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Rapports récents</CardTitle>
              <CardDescription>Statut de vos derniers rapports mensuels</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/cooperative/reports">Voir tout <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {coop.reports.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg px-3 py-2.5 -mx-3 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium">{monthLabel(r.month, r.year)}</p>
                </div>
                <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
              </div>
            ))}
            {coop.reports.length === 0 && <p className="text-sm text-muted-foreground py-4">Aucun rapport soumis pour le moment.</p>}
          </CardContent>
        </Card>
      </div>

      {coop.conventions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ScrollText className="h-4 w-4" /> Conventions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {coop.conventions.map((c) => (
              <div key={c.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{c.title}</p>
                  <Badge variant={c.status === "ACTIVE" ? "success" : c.status === "EXPIRING" ? "warning" : c.status === "EXPIRED" ? "destructive" : "secondary"}>
                    {c.status === "ACTIVE" ? "Active" : c.status === "EXPIRING" ? "Expire bientôt" : c.status === "EXPIRED" ? "Expirée" : "Brouillon"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{c.reference} · Budget {c.budget.toLocaleString("fr-FR")} MAD</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
