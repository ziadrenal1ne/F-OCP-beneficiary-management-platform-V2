import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tooltipStyle, CHART_COLORS } from "@/components/charts/chart-theme";
import { getAnalytics } from "@/lib/server/api";
import { formatNumber, monthLabel } from "@/lib/utils";

export const Route = createFileRoute("/_app/analytique")({ component: AnalyticsPage });

function AnalyticsPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getAnalytics>> | null>(null);
  useEffect(() => {
    void getAnalytics().then(setData);
  }, []);
  if (!data) return <p className="text-sm text-muted-foreground">Chargement des indicateurs…</p>;

  const monthly = data.monthly.map((m) => ({
    label: monthLabel(m.month),
    total: m.women + m.men,
    femmes: m.women,
    jeunes: m.youth,
  }));
  const growth =
    monthly.length >= 2
      ? ((monthly[monthly.length - 1].total - monthly[0].total) / Math.max(1, monthly[0].total)) * 100
      : 0;
  const gender = [
    { name: "Femmes", value: data.gender.women },
    { name: "Hommes", value: data.gender.men },
  ];
  const status = data.byStatus.map((s) => ({
    name: s.status === "active" ? "Actives" : s.status === "pending" ? "En attente" : "Suspendues",
    value: s.count,
  }));

  return (
    <div>
      <PageHeader
        title="Analytique"
        description={`Croissance des bénéficiaires directs : ${growth.toFixed(1)} % sur la période.`}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Tendance des bénéficiaires</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="total" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Genre</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gender} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {gender.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Bénéficiaires par région</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byRegion} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="region" width={140} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="beneficiaries" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Par secteur</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bySector}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="sector" hide />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="beneficiaries" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4 p-5">
        <p className="text-sm font-medium">Statuts des coopératives</p>
        <div className="mt-3 flex flex-wrap gap-4">
          {status.map((s) => (
            <div key={s.name}>
              <p className="text-xs text-muted-foreground">{s.name}</p>
              <p className="font-display text-2xl tabular-nums">{formatNumber(s.value)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
