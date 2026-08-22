import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MoroccoMap } from "@/components/map/morocco-map";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listCooperatives, listFilterOptions, listOdds } from "@/lib/server/api";
import { COOP_STATUSES } from "@/lib/constants";
import type { Cooperative } from "@/lib/types";

export const Route = createFileRoute("/_app/carte")({ component: MapPage });

function MapPage() {
  const [all, setAll] = useState<Cooperative[]>([]);
  const [region, setRegion] = useState("all");
  const [sector, setSector] = useState("all");
  const [status, setStatus] = useState("all");
  const [odd, setOdd] = useState("all");
  const [options, setOptions] = useState<{ regions: string[]; sectors: string[] }>({ regions: [], sectors: [] });
  const [odds, setOdds] = useState<{ code: number; shortName: string }[]>([]);

  useEffect(() => {
    void listCooperatives({ data: {} }).then(setAll);
    void listFilterOptions().then((o) => setOptions({ regions: o.regions, sectors: o.sectors }));
    void listOdds().then(setOdds);
  }, []);

  const filtered = useMemo(
    () =>
      all.filter((c) => {
        if (region !== "all" && c.region !== region) return false;
        if (sector !== "all" && c.sector !== sector) return false;
        if (status !== "all" && c.status !== status) return false;
        if (odd !== "all" && !c.odds.some((o) => o.code === Number(odd))) return false;
        return true;
      }),
    [all, region, sector, status, odd],
  );

  return (
    <div>
      <PageHeader
        title="Carte des coopératives"
        description={`${filtered.length} marqueurs · survolez un point pour le détail, cliquez pour ouvrir le profil.`}
      />
      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger><SelectValue placeholder="Région" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les régions</SelectItem>
            {options.regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger><SelectValue placeholder="Activité" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les activités</SelectItem>
            {options.sectors.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={odd} onValueChange={setOdd}>
          <SelectTrigger><SelectValue placeholder="ODD" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les ODD</SelectItem>
            {odds.map((o) => <SelectItem key={o.code} value={String(o.code)}>ODD {o.code} — {o.shortName}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {COOP_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Card className="overflow-hidden p-2">
        <MoroccoMap cooperatives={filtered} />
      </Card>
    </div>
  );
}
