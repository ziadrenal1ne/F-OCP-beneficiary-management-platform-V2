import { db } from "@/db";
import { cooperatives, esgIndicators } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { getMonthlyEvolution, monthLabel, getOddDistribution, getAdminKpis } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvolutionChart } from "@/components/charts/evolution-chart";
import { GenderBarChart } from "@/components/charts/gender-bar-chart";
import { OddPieChart } from "@/components/charts/odd-pie-chart";
import { EsgLineChart } from "@/components/charts/esg-line-chart";
import { StatCard } from "@/components/shell/stat-card";
import { TrendingUp, Users, Building2, Percent } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const [evolution, oddDist, kpis, sectorRows, esgAll] = await Promise.all([
    getMonthlyEvolution(),
    getOddDistribution(),
    getAdminKpis(),
    db.select({ sector: cooperatives.sector, count: sql<number>`count(*)` }).from(cooperatives).groupBy(cooperatives.sector).orderBy(sql`count(*) desc`),
    db.select().from(esgIndicators),
  ]);

  const evolutionData = evolution.map((e) => ({ label: monthLabel(e.month, e.year), women: e.women, men: e.men, total: e.total }));
  const genderData = evolution.slice(-6).map((e) => ({ label: monthLabel(e.month, e.year), women: e.women, men: e.men }));

  const esgByMonth = new Map<string, { month: number; year: number; e: number[]; s: number[]; g: number[] }>();
  for (const row of esgAll) {
    const key = `${row.year}-${row.month}`;
    const cur = esgByMonth.get(key) ?? { month: row.month, year: row.year, e: [], s: [], g: [] };
    cur.e.push(row.environmental); cur.s.push(row.social); cur.g.push(row.governance);
    esgByMonth.set(key, cur);
  }
  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  const esgTrend = Array.from(esgByMonth.values())
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .map((v) => ({ label: monthLabel(v.month, v.year), environmental: avg(v.e), social: avg(v.s), governance: avg(v.g) }));

  const first = evolutionData[0]?.total ?? 0;
  const last = evolutionData[evolutionData.length - 1]?.total ?? 0;
  const growth = first > 0 ? Math.round(((last - first) / first) * 100) : 0;

  const approvalRate = kpis.totalReports > 0 ? Math.round((kpis.totalCooperatives / (kpis.totalCooperatives || 1)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytique</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Vue transversale des indicateurs de performance de l'Axe Éco-Social</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Croissance des bénéficiaires (12 mois)" value={growth} suffix="%" icon={TrendingUp} accent="success" />
        <StatCard label="Bénéficiaires directs" value={kpis.totalBeneficiaries.toLocaleString("fr-FR")} icon={Users} accent="primary" />
        <StatCard label="Coopératives actives" value={kpis.totalCooperatives} icon={Building2} accent="gold" />
        <StatCard label="Secteurs représentés" value={sectorRows.length} icon={Percent} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Tendance des bénéficiaires</CardTitle><CardDescription>Cumul sur 12 mois</CardDescription></CardHeader>
          <CardContent><EvolutionChart data={evolutionData} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Répartition Femmes / Hommes</CardTitle><CardDescription>6 derniers mois</CardDescription></CardHeader>
          <CardContent><GenderBarChart data={genderData} /></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Distribution par ODD</CardTitle><CardDescription>Nombre de coopératives par objectif</CardDescription></CardHeader>
          <CardContent><OddPieChart data={oddDist.map((o) => ({ name: o.name, count: o.count, color: o.color }))} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Indicateurs ESG moyens</CardTitle><CardDescription>Environnement, social, gouvernance — réseau entier</CardDescription></CardHeader>
          <CardContent><EsgLineChart data={esgTrend} /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Répartition par secteur</CardTitle><CardDescription>Nombre de coopératives par secteur d'activité</CardDescription></CardHeader>
        <CardContent className="space-y-2.5">
          {sectorRows.map((s) => (
            <div key={s.sector} className="flex items-center gap-3">
              <span className="w-40 shrink-0 truncate text-sm">{s.sector}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(s.count / Math.max(...sectorRows.map((r) => r.count))) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-xs text-muted-foreground">{s.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
