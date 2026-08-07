import { getAllCooperatives, getFilterOptions } from "@/lib/data";
import { MapLoader } from "@/components/map/map-loader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search } from "lucide-react";

export default async function AdminMapPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; sector?: string; status?: string; odd?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const [cooperatives, filters] = await Promise.all([
    getAllCooperatives({
      region: sp.region, sector: sp.sector, status: sp.status, search: sp.q,
      oddNumber: sp.odd ? Number(sp.odd) : undefined,
    }),
    getFilterOptions(),
  ]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Carte interactive</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{cooperatives.length} coopérative(s) affichée(s) sur la carte</p>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 sm:grid-cols-5" method="get">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={sp.q} placeholder="Rechercher…" className="pl-9" />
          </div>
          <Select name="region" defaultValue={sp.region ?? "all"}>
            <SelectTrigger><SelectValue placeholder="Région" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              {filters.regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select name="odd" defaultValue={sp.odd ?? "all"}>
            <SelectTrigger><SelectValue placeholder="ODD" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les ODD</SelectItem>
              {filters.odds.map((o) => <SelectItem key={o.number} value={String(o.number)}>ODD {o.number} — {o.nameFr}</SelectItem>)}
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

      <Card className="flex-1 min-h-[520px] overflow-hidden p-0">
        <MapLoader
          cooperatives={cooperatives.map((c) => ({
            id: c.id, name: c.name, city: c.city, country: c.country, region: c.region,
            sector: c.sector, status: c.status, latitude: c.latitude, longitude: c.longitude,
            beneficiaries: c.beneficiaries ? c.beneficiaries.women + c.beneficiaries.men : undefined,
            odds: c.odds,
          }))}
        />
      </Card>
    </div>
  );
}
