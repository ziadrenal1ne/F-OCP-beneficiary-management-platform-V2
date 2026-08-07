import { getAllCooperatives, getFilterOptions } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { MapPin, Search, Users } from "lucide-react";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

const STATUS_LABEL: Record<string, string> = { ACTIVE: "Active", PENDING: "En attente", SUSPENDED: "Suspendue" };
const STATUS_VARIANT: Record<string, any> = { ACTIVE: "success", PENDING: "warning", SUSPENDED: "destructive" };

export default async function AdminCooperativesPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; sector?: string; status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const [cooperatives, filters] = await Promise.all([
    getAllCooperatives({ region: sp.region, sector: sp.sector, status: sp.status, search: sp.q }),
    getFilterOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Coopératives</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{cooperatives.length} coopérative(s) trouvée(s)</p>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 sm:grid-cols-4" method="get">
          <div className="relative sm:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={sp.q} placeholder="Nom, ville…" className="pl-9" />
          </div>
          <Select name="region" defaultValue={sp.region ?? "all"}>
            <SelectTrigger><SelectValue placeholder="Région" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              {filters.regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select name="sector" defaultValue={sp.sector ?? "all"}>
            <SelectTrigger><SelectValue placeholder="Secteur" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les secteurs</SelectItem>
              {filters.sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cooperatives.map((c) => (
          <Link key={c.id} href={`/admin/cooperatives/${c.id}`}>
            <Card className="h-full p-4 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white"
                  style={{ background: c.logoColor }}
                >
                  {c.name.split(" ").slice(-1)[0]?.[0] ?? "C"}
                </div>
                <Badge variant={STATUS_VARIANT[c.status]}>{STATUS_LABEL[c.status]}</Badge>
              </div>
              <p className="mt-3 text-sm font-medium leading-tight line-clamp-1">{c.name}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {c.city}, {c.region}
              </p>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{c.sector}</p>
              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {c.beneficiaries ? (c.beneficiaries.women + c.beneficiaries.men).toLocaleString("fr-FR") : "—"} bénéficiaires
                </span>
                <div className="flex -space-x-1">
                  {c.odds.slice(0, 3).map((o, i) => (
                    <span key={i} className="h-4 w-4 rounded-full border border-card" style={{ background: o.color }} title={o.name} />
                  ))}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {cooperatives.length === 0 && (
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">Aucune coopérative ne correspond à ces critères.</CardContent></Card>
      )}
    </div>
  );
}
