import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  FileText,
  Handshake,
  HeartHandshake,
  Users,
  UserRound,
  Accessibility,
  Bell,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { tooltipStyle } from "@/components/charts/chart-theme";
import { getDashboard, listNotifications } from "@/lib/server/api";
import { formatDate, formatNumber, monthLabel } from "@/lib/utils";
import type { NotificationItem } from "@/lib/types";

export const Route = createFileRoute("/_app/tableau")({ component: DashboardPage });

function DashboardPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [notes, setNotes] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getDashboard(), listNotifications()])
      .then(([d, n]) => {
        setData(d);
        setNotes(n.slice(0, 5));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Erreur de chargement"));
  }, []);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }
  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  const { kpis, monthly, odds, activity, recentReports, esg, actor } = data;
  const chartData = monthly.map((m) => ({
    label: monthLabel(m.month),
    femmes: m.women,
    hommes: m.men,
    jeunes: m.youth,
    total: m.women + m.men,
  }));
  const pieData = odds.slice(0, 8).map((o) => ({ name: `ODD ${o.code}`, value: o.count, color: o.color }));
  const isAdmin = actor.role === "admin";

  return (
    <div>
      <PageHeader
        eyebrow={isAdmin ? "Pilotage national" : "Espace coopérative"}
        title={isAdmin ? "Tableau de bord" : "Ma coopérative"}
        description={
          isAdmin
            ? "Vue consolidée des coopératives accompagnées par l'Axe Éco-Social."
            : "Suivi de vos bénéficiaires, rapports et indicateurs ESG."
        }
        actions={
          <>
            {isAdmin ? (
              <Button asChild variant="outline">
                <Link to="/import">Importer un CSV</Link>
              </Button>
            ) : null}
            <Button asChild>
              <Link to="/rapports/nouveau">Nouveau rapport</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Coopératives" value={kpis.cooperatives} icon={Building2} />
        <KpiCard label="Bénéficiaires" value={kpis.beneficiaries} hint="Directs (femmes + hommes)" icon={Users} />
        <KpiCard label="Femmes" value={kpis.women} icon={HeartHandshake} />
        <KpiCard label="Hommes" value={kpis.men} icon={UserRound} />
        <KpiCard label="Jeunes" value={kpis.youth} icon={Users} />
        <KpiCard label="Personnes en situation de handicap" value={kpis.disabled} icon={Accessibility} />
        <KpiCard label="Bénéficiaires indirects" value={kpis.indirect} icon={Users} />
        <KpiCard
          label="Validations en attente"
          value={kpis.pendingValidations}
          hint={`${formatNumber(kpis.reports)} rapports · ${formatNumber(kpis.conventions)} conventions`}
          icon={FileText}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Évolution mensuelle des bénéficiaires</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="femmes" stackId="1" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} />
                <Area type="monotone" dataKey="hommes" stackId="1" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Répartition des ODD</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2}>
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Rapports récents</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/rapports">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReports.map((r) => (
              <Link key={r.id} to="/rapports/$id" params={{ id: String(r.id) }} className="block rounded-xl bg-muted/50 p-3 hover:bg-muted">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.cooperativeName}</p>
                  </div>
                  <StatusBadge value={r.status} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune notification.</p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="rounded-xl bg-muted/50 p-3">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(n.createdAt)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs ESG</CardTitle>
          </CardHeader>
          <CardContent>
            {esg ? (
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Environnement</dt>
                  <dd className="font-display text-xl tabular-nums">{esg.environmentalScore.toFixed(1)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Social</dt>
                  <dd className="font-display text-xl tabular-nums">{esg.socialScore.toFixed(1)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Gouvernance</dt>
                  <dd className="font-display text-xl tabular-nums">{esg.governanceScore.toFixed(1)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Emplois créés</dt>
                  <dd className="font-display text-xl tabular-nums">{formatNumber(esg.jobsCreated)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-muted-foreground">Eau économisée</dt>
                  <dd className="tabular-nums">{formatNumber(esg.waterSavedM3)} m³</dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">Pas encore d'indicateurs.</p>
            )}
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Handshake className="h-3.5 w-3.5" />
              {formatNumber(kpis.conventions)} conventions · {formatNumber(kpis.documents)} documents
            </div>
          </CardContent>
        </Card>
      </div>

      {isAdmin ? (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {activity.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                  <div>
                    <p className="font-medium capitalize">{a.action} · {a.entityType}</p>
                    <p className="text-xs text-muted-foreground">{a.details}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
