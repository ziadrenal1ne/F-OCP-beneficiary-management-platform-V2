import { getSession } from "@/lib/auth";
import {
  getAdminKpis, getMonthlyEvolution, monthLabel, getOddDistribution,
  getRecentActivity, getPendingReports, getConventionsExpiringSoon, getAllCooperatives,
} from "@/lib/data";
import { StatCard } from "@/components/shell/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvolutionChart } from "@/components/charts/evolution-chart";
import { OddPieChart } from "@/components/charts/odd-pie-chart";
import {
  Building2, Users, Baby, Accessibility, FileCheck2, ScrollText,
  Clock, ArrowRight, Activity, MapPin,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default async function AdminDashboard() {
  const session = await getSession();
  const [kpis, evolution, oddDist, activity, pendingReports, expiringConventions, cooperatives] = await Promise.all([
    getAdminKpis(),
    getMonthlyEvolution(),
    getOddDistribution(),
    getRecentActivity(6),
    getPendingReports(),
    getConventionsExpiringSoon(60),
    getAllCooperatives(),
  ]);

  const evolutionData = evolution.slice(-8).map((e) => ({ label: monthLabel(e.month, e.year), women: e.women, men: e.men, total: e.total }));
  const activeCoops = cooperatives.filter((c) => c.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bonjour, {session?.name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Voici l'état de l'Axe Éco-Social aujourd'hui.</p>
        </div>
        <Badge variant="success" className="gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> {activeCoops} coopératives actives
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Coopératives" value={kpis.totalCooperatives} icon={Building2} accent="primary" trend={4} />
        <StatCard label="Bénéficiaires directs" value={kpis.totalBeneficiaries.toLocaleString("fr-FR")} icon={Users} accent="gold" trend={6} />
        <StatCard label="Bénéficiaires indirects" value={kpis.indirect.toLocaleString("fr-FR")} icon={Activity} accent="success" trend={3} />
        <StatCard label="Validations en attente" value={kpis.pendingValidations} icon={Clock} accent="default" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Femmes bénéficiaires" value={kpis.women.toLocaleString("fr-FR")} icon={Users} />
        <StatCard label="Jeunes (moins de 35 ans)" value={kpis.youth.toLocaleString("fr-FR")} icon={Baby} />
        <StatCard label="Personnes en situation de handicap" value={kpis.disabled.toLocaleString("fr-FR")} icon={Accessibility} />
        <StatCard label="Conventions actives" value={kpis.totalConventions} icon={ScrollText} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Évolution mensuelle des bénéficiaires</CardTitle>
              <CardDescription>Cumul direct — femmes et hommes, 8 derniers mois</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <EvolutionChart data={evolutionData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par ODD</CardTitle>
            <CardDescription>Objectifs de Développement Durable</CardDescription>
          </CardHeader>
          <CardContent>
            <OddPieChart data={oddDist.map((o) => ({ name: o.name, count: o.count, color: o.color }))} />
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {oddDist.slice(0, 6).map((o) => (
                <div key={o.oddNumber} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: o.color }} />
                  <span className="truncate text-muted-foreground">{o.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Rapports en attente de validation</CardTitle>
              <CardDescription>{pendingReports.length} rapport(s) soumis nécessitent une revue</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/reports">Voir tout <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {pendingReports.length === 0 && <p className="text-sm text-muted-foreground py-4">Aucun rapport en attente. Tout est à jour ✨</p>}
            {pendingReports.slice(0, 5).map((r) => (
              <Link
                key={r.id}
                href={`/admin/cooperatives/${r.cooperativeId}`}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 -mx-3 transition-colors hover:bg-secondary"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.cooperativeName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {r.cooperativeCity} · {monthLabel(r.month, r.year)}
                    </p>
                  </div>
                </div>
                <Badge variant="warning" className="shrink-0">En attente</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Journal d'audit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0">
                  <p className="text-xs font-medium">{a.action} · {a.entity}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.detail}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                    {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true, locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {expiringConventions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-warning-foreground" /> Conventions arrivant à échéance
            </CardTitle>
            <CardDescription>Dans les 60 prochains jours</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {expiringConventions.map((c) => (
              <div key={c.id} className="rounded-lg border p-3">
                <p className="text-sm font-medium truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.cooperativeName}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Échéance : {new Date(c.endDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
