import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listCooperatives, listFilterOptions, listOdds } from "@/lib/server/api";
import { COOP_STATUSES } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import type { Cooperative } from "@/lib/types";

export const Route = createFileRoute("/_app/recherche")({ component: SearchPage });

function SearchPage() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");
  const [province, setProvince] = useState("all");
  const [city, setCity] = useState("all");
  const [country, setCountry] = useState("Maroc");
  const [sector, setSector] = useState("all");
  const [status, setStatus] = useState("all");
  const [odd, setOdd] = useState("all");
  const [minBeneficiaries, setMinBeneficiaries] = useState(0);
  const [options, setOptions] = useState<{ regions: string[]; cities: string[]; provinces: string[]; sectors: string[] }>({
    regions: [],
    cities: [],
    provinces: [],
    sectors: [],
  });
  const [odds, setOdds] = useState<{ code: number; shortName: string }[]>([]);
  const [rows, setRows] = useState<Cooperative[] | null>(null);

  useEffect(() => {
    void listFilterOptions().then(setOptions);
    void listOdds().then(setOdds);
  }, []);

  function search() {
    void listCooperatives({
      data: {
        q: q || undefined,
        region: region === "all" ? undefined : region,
        province: province === "all" ? undefined : province,
        city: city === "all" ? undefined : city,
        country: country || undefined,
        sector: sector === "all" ? undefined : sector,
        status: status === "all" ? undefined : status,
        odd: odd === "all" ? undefined : Number(odd),
        minBeneficiaries: minBeneficiaries || undefined,
      },
    }).then(setRows);
  }

  return (
    <div>
      <PageHeader title="Recherche avancée" description="Nom, territoire, secteur, ODD et volume de bénéficiaires." />
      <form
        className="mb-6 grid gap-3 rounded-2xl bg-card p-5 shadow-card sm:grid-cols-2 lg:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <Field label="Nom">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Al Amal, argan…" />
        </Field>
        <Field label="Pays">
          <Input value={country} onChange={(e) => setCountry(e.target.value)} />
        </Field>
        <Field label="Région">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {options.regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Province">
          <Select value={province} onValueChange={setProvince}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {options.provinces.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Ville">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {options.cities.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Secteur">
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {options.sectors.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Statut">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {COOP_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="ODD">
          <Select value={odd} onValueChange={setOdd}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {odds.map((o) => <SelectItem key={o.code} value={String(o.code)}>ODD {o.code} — {o.shortName}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Bénéficiaires min.">
          <Input type="number" min={0} value={minBeneficiaries} onChange={(e) => setMinBeneficiaries(Number(e.target.value))} />
        </Field>
        <div className="flex items-end">
          <Button type="submit">Rechercher</Button>
        </div>
      </form>
      {rows ? (
        <p className="mb-3 text-sm text-muted-foreground">{formatNumber(rows.length)} résultat(s)</p>
      ) : null}
      <div className="space-y-2">
        {rows?.map((c) => (
          <Link key={c.id} to="/cooperatives/$id" params={{ id: String(c.id) }}>
            <Card className="flex items-center justify-between p-4 hover:shadow-card-hover">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.city} · {c.province} · {c.region} · {c.sector}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums">{formatNumber(c.totalDirect)}</span>
                <StatusBadge value={c.status} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
