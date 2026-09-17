import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tooltipStyle } from "@/components/charts/chart-theme";
import { listCooperatives, listOdds } from "@/lib/server/api";
import { formatNumber } from "@/lib/utils";

export const Route = createFileRoute("/_app/odds")({ component: OddsPage });

function OddsPage() {
  const [odds, setOdds] = useState<{ code: number; nameFr: string; shortName: string; color: string; count: number }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [names, setNames] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    void listOdds().then(setOdds);
  }, []);

  useEffect(() => {
    if (!selected) {
      setNames([]);
      return;
    }
    void listCooperatives({ data: { odd: selected } }).then((rows) =>
      setNames(rows.map((c) => ({ id: c.id, name: c.name }))),
    );
  }, [selected]);

  return (
    <div>
      <PageHeader
        title="Objectifs de développement durable"
        description="Chaque coopérative est liée à un ou plusieurs ODD. Cliquez une barre pour filtrer."
      />
      <Card className="mb-4">
        <CardHeader><CardTitle>Distribution</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={odds.map((o) => ({ name: `${o.code}`, count: o.count, full: o.nameFr }))}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="count"
                fill="var(--chart-1)"
                radius={[6, 6, 0, 0]}
                onClick={(d) => setSelected(Number((d as { name?: string }).name))}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {odds.map((o) => (
          <button
            key={o.code}
            type="button"
            onClick={() => setSelected(o.code)}
            className="rounded-2xl bg-card p-4 text-left shadow-card hover:shadow-card-hover"
          >
            <p className="text-xs font-medium text-muted-foreground">ODD {o.code}</p>
            <p className="mt-1 font-medium">{o.nameFr}</p>
            <p className="mt-2 text-sm tabular-nums text-muted-foreground">{formatNumber(o.count)} coopératives</p>
          </button>
        ))}
      </div>
      {selected ? (
        <div className="mt-6">
          <h2 className="font-display text-lg">Coopératives — ODD {selected}</h2>
          <ul className="mt-2 space-y-1">
            {names.map((n) => (
              <li key={n.id}>
                <Link to="/cooperatives/$id" params={{ id: String(n.id) }} className="text-sm hover:underline">
                  {n.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
