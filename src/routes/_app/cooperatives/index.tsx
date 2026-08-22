import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { exportCooperatives, listCooperatives, listFilterOptions, listOdds } from "@/lib/server/api";
import { COOP_STATUSES } from "@/lib/constants";
import { downloadBlob, formatNumber } from "@/lib/utils";
import { useActor } from "@/hooks/use-actor";
import type { Cooperative } from "@/lib/types";

export const Route = createFileRoute("/_app/cooperatives/")({ component: CooperativesPage });

function CooperativesPage() {
  const { actor } = useActor();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");
  const [sector, setSector] = useState("all");
  const [status, setStatus] = useState("all");
  const [odd, setOdd] = useState("all");
  const [rows, setRows] = useState<Cooperative[] | null>(null);
  const [options, setOptions] = useState<{ regions: string[]; sectors: string[] }>({ regions: [], sectors: [] });
  const [odds, setOdds] = useState<{ code: number; shortName: string }[]>([]);

  function load() {
    void listCooperatives({
      data: {
        q: q || undefined,
        region: region === "all" ? undefined : region,
        sector: sector === "all" ? undefined : sector,
        status: status === "all" ? undefined : status,
        odd: odd === "all" ? undefined : Number(odd),
      },
    }).then(setRows);
  }

  useEffect(() => {
    load();
    void listFilterOptions().then((o) => setOptions({ regions: o.regions, sectors: o.sectors }));
    void listOdds().then((o) => setOdds(o));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, region, sector, status, odd]);

  const total = useMemo(() => rows?.reduce((s, c) => s + c.totalDirect, 0) ?? 0, [rows]);

  async function onExportCsv() {
    try {
      const data = await exportCooperatives();
      const header = "id,name,city,province,region,sector,status,women,men,youth,disabled,indirect";
      const body = data
        .map((c) =>
          [c.id, csv(c.name), csv(c.city), csv(c.province), csv(c.region), csv(c.sector), c.status, c.women, c.men, c.youth, c.disabled, c.indirect].join(","),
        )
        .join("\n");
      downloadBlob("cooperatives-focp.csv", new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" }));
      toast.success("Export CSV téléchargé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export impossible");
    }
  }

  async function onExportXlsx() {
    try {
      const data = await exportCooperatives();
      const xlsx = await import("xlsx");
      const ws = xlsx.utils.json_to_sheet(
        data.map((c) => ({
          Nom: c.name,
          Ville: c.city,
          Province: c.province,
          Région: c.region,
          Secteur: c.sector,
          Statut: c.status,
          Femmes: c.women,
          Hommes: c.men,
          Jeunes: c.youth,
          Handicap: c.disabled,
          Indirects: c.indirect,
        })),
      );
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Coopératives");
      xlsx.writeFile(wb, "cooperatives-focp.xlsx");
      toast.success("Export Excel téléchargé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export impossible");
    }
  }

  async function onExportPdf() {
    try {
      const data = await exportCooperatives();
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ orientation: "landscape" });
      doc.setFontSize(14);
      doc.text("Fondation OCP — Coopératives Axe Éco-Social", 14, 16);
      autoTable(doc, {
        startY: 22,
        head: [["Nom", "Ville", "Région", "Secteur", "Bénéf."]],
        body: data.slice(0, 80).map((c) => [c.name, c.city, c.region, c.sector, String(c.totalDirect)]),
        styles: { fontSize: 8 },
      });
      doc.save("cooperatives-focp.pdf");
      toast.success("Export PDF téléchargé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export impossible");
    }
  }

  return (
    <div>
      <PageHeader
        title="Coopératives"
        description={`${rows ? formatNumber(rows.length) : "…"} structures · ${formatNumber(total)} bénéficiaires directs`}
        actions={
          actor?.role === "admin" ? (
            <>
              <Button variant="outline" size="sm" onClick={() => void onExportCsv()}>
                <Download className="h-4 w-4" /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => void onExportXlsx()}>
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => void onExportPdf()}>
                PDF
              </Button>
            </>
          ) : null
        }
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Rechercher un nom, une ville…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger><SelectValue placeholder="Région" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les régions</SelectItem>
            {options.regions.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger><SelectValue placeholder="Secteur" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les secteurs</SelectItem>
            {options.sectors.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {COOP_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4 max-w-xs">
        <Select value={odd} onValueChange={setOdd}>
          <SelectTrigger><SelectValue placeholder="ODD" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les ODD</SelectItem>
            {odds.map((o) => (
              <SelectItem key={o.code} value={String(o.code)}>ODD {o.code} — {o.shortName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!rows ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <Link key={c.id} to="/cooperatives/$id" params={{ id: String(c.id) }}>
              <Card className="h-full p-5 transition-shadow hover:shadow-card-hover">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-xs font-semibold text-accent-foreground">
                    {c.logoInitials}
                  </span>
                  <StatusBadge value={c.status} />
                </div>
                <h3 className="mt-3 font-medium leading-snug">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.city} · {c.region}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{c.sector}</p>
                <p className="mt-3 text-sm tabular-nums">
                  {formatNumber(c.totalDirect)} bénéficiaires
                  <span className="text-muted-foreground"> · {formatNumber(c.women)} femmes</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.odds.slice(0, 4).map((o) => (
                    <span key={o.id} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                      ODD {o.code}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function csv(v: string) {
  if (v.includes(",") || v.includes('"')) return `"${v.replaceAll('"', '""')}"`;
  return v;
}
