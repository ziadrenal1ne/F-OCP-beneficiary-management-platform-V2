import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tooltipStyle } from "@/components/charts/chart-theme";
import { getCooperative, listCooperatives, upsertBeneficiaryStats } from "@/lib/server/api";
import { formatNumber, monthLabel } from "@/lib/utils";
import { useActor } from "@/hooks/use-actor";
import type { BeneficiaryMonth, Cooperative } from "@/lib/types";

export const Route = createFileRoute("/_app/beneficiaires")({ component: BeneficiariesPage });

function BeneficiariesPage() {
  const { actor } = useActor();
  const [coops, setCoops] = useState<Cooperative[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [months, setMonths] = useState<BeneficiaryMonth[]>([]);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [form, setForm] = useState({ women: 0, men: 0, youth: 0, adults: 0, children: 0, disabled: 0, indirect: 0 });

  useEffect(() => {
    void listCooperatives({ data: {} }).then((rows) => {
      setCoops(rows);
      const id = actor?.cooperativeId ?? rows[0]?.id ?? null;
      setSelected(id);
    });
  }, [actor?.cooperativeId]);

  useEffect(() => {
    if (!selected) return;
    void getCooperative({ data: { id: selected } }).then((p) => {
      setMonths(p.months);
      const last = p.months[p.months.length - 1];
      if (last) {
        setForm({
          women: last.women,
          men: last.men,
          youth: last.youth,
          adults: last.adults,
          children: last.children,
          disabled: last.disabled,
          indirect: last.indirect,
        });
      }
    });
  }, [selected]);

  const chart = months.map((m) => ({
    label: `${monthLabel(m.month)} ${String(m.year).slice(2)}`,
    femmes: m.women,
    hommes: m.men,
    jeunes: m.youth,
  }));

  return (
    <div>
      <PageHeader
        title="Bénéficiaires"
        description="Statistiques mensuelles : femmes, hommes, jeunes, adultes, enfants, handicap et indirects."
      />
      {actor?.role === "admin" ? (
        <div className="mb-4 max-w-md">
          <Select value={selected ? String(selected) : ""} onValueChange={(v) => setSelected(Number(v))}>
            <SelectTrigger><SelectValue placeholder="Coopérative" /></SelectTrigger>
            <SelectContent>
              {coops.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <Card className="mb-4">
        <CardHeader><CardTitle>Évolution</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="femmes" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
              <Area type="monotone" dataKey="hommes" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.25} />
              <Area type="monotone" dataKey="jeunes" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <form
        className="grid gap-3 rounded-2xl bg-card p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!selected) return;
          void upsertBeneficiaryStats({ data: { cooperativeId: selected, year, month, ...form } })
            .then(() => {
              toast.success("Statistiques enregistrées");
              return getCooperative({ data: { id: selected } });
            })
            .then((p) => { if (p) setMonths(p.months); })
            .catch((err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur"));
        }}
      >
        <Field label="Année"><Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} /></Field>
        <Field label="Mois"><Input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} /></Field>
        {(["women", "men", "youth", "adults", "children", "disabled", "indirect"] as const).map((k) => (
          <Field key={k} label={labelOf(k)}>
            <Input type="number" min={0} value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: Number(e.target.value) }))} />
          </Field>
        ))}
        <div className="sm:col-span-2 lg:col-span-4">
          <Button type="submit">Mettre à jour le mois</Button>
        </div>
      </form>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-card shadow-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted-foreground">
            <tr>
              {["Période", "Femmes", "Hommes", "Jeunes", "Adultes", "Enfants", "Handicap", "Indirects"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...months].reverse().map((m) => (
              <tr key={`${m.year}-${m.month}`} className="border-b border-border last:border-0">
                <td className="px-4 py-2">{monthLabel(m.month)} {m.year}</td>
                <td className="px-4 py-2 tabular-nums">{formatNumber(m.women)}</td>
                <td className="px-4 py-2 tabular-nums">{formatNumber(m.men)}</td>
                <td className="px-4 py-2 tabular-nums">{formatNumber(m.youth)}</td>
                <td className="px-4 py-2 tabular-nums">{formatNumber(m.adults)}</td>
                <td className="px-4 py-2 tabular-nums">{formatNumber(m.children)}</td>
                <td className="px-4 py-2 tabular-nums">{formatNumber(m.disabled)}</td>
                <td className="px-4 py-2 tabular-nums">{formatNumber(m.indirect)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function labelOf(k: string) {
  const map: Record<string, string> = {
    women: "Femmes",
    men: "Hommes",
    youth: "Jeunes",
    adults: "Adultes",
    children: "Enfants",
    disabled: "Handicap",
    indirect: "Indirects",
  };
  return map[k] ?? k;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
