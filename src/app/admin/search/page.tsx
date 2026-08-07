import { getAllCooperatives, getFilterOptions } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users } from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = { ACTIVE: "Active", PENDING: "En attente", SUSPENDED: "Suspendue" };
const STATUS_VARIANT: Record<string, any> = { ACTIVE: "success", PENDING: "warning", SUSPENDED: "destructive" };

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; region?: string; province?: string; sector?: string; status?: string; odd?: string }>;
}) {
  const sp = await searchParams;
  const hasQuery = Object.values(sp).some(Boolean);
  const [results, filters] = await Promise.all([
    hasQuery
      ? getAllCooperatives({
          search: sp.q, region: sp.region, province: sp.province, sector: sp.sector, status: sp.status,
          oddNumber: sp.odd ? Number(sp.odd) : undefined,
        })
      : Promise.resolve([]),
    getFilterOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Recherche avancée</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Recherchez par nom, région, province, ville, secteur, statut, ODD ou nombre de bénéficiaires.</p>
      </div>

      <Card className="p-5">
        <form className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5" method="get">
          <div className="relative sm:col-span-3 lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={sp.q} placeholder="Nom, ville, province…" className="pl-9" />
          </div>
          <Select name="region" defaultValue={sp.region ?? "all"}>
            <SelectTrigger><SelectValue placeholder="Région" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Toutes les régions</SelectItem>{filters.regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
          <Select name="sector" defaultValue={sp.sector ?? "all"}>
            <SelectTrigger><SelectValue placeholder="Secteur" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Tous les secteurs</SelectItem>{filters.sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select name="odd" defaultValue={sp.odd ?? "all"}>
            <SelectTrigger><SelectValue placeholder="ODD" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Tous les ODD</SelectItem>{filters.odds.map((o) => <SelectItem key={o.number} value={String(o.number)}>ODD {o.number}</SelectItem>)}</SelectContent>
          </Select>
          <Select name="status" defaultValue={sp.status ?? "all"}>
            <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="SUSPENDED">Suspendue</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </Card>

      {!hasQuery && (
        <Card><CardContent className="py-14 text-center text-sm text-muted-foreground">Utilisez les filtres ci-dessus pour lancer une recherche.</CardContent></Card>
      )}

      {hasQuery && (
        <>
          <p className="text-sm text-muted-foreground">{results.length} résultat(s)</p>
          <div className="space-y-2">
            {results.map((c) => (
              <Link key={c.id} href={`/admin/cooperatives/${c.id}`}>
                <Card className="flex items-center justify-between gap-3 p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white" style={{ background: c.logoColor }}>
                      {c.name.split(" ").slice(-1)[0]?.[0] ?? "C"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {c.city}, {c.region} · {c.sector}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {c.beneficiaries ? (c.beneficiaries.women + c.beneficiaries.men).toLocaleString("fr-FR") : "—"}
                    </span>
                    <Badge variant={STATUS_VARIANT[c.status]}>{STATUS_LABEL[c.status]}</Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
