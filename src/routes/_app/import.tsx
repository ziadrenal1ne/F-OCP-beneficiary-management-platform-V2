import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { importCooperativesCsv } from "@/lib/server/api";
import { useActor } from "@/hooks/use-actor";
import type { CsvImportResult } from "@/lib/types";

export const Route = createFileRoute("/_app/import")({ component: ImportPage });

const SAMPLE = `name,city,province,region,sector,address,lat,lng,phone,email,status
Coopérative Demo Témara,Témara,Skhirate-Témara,Rabat-Salé-Kénitra,Agriculture,12 avenue Hassan II,33.9272,-6.9128,+212 537000000,demo@focp.ma,pending`;

function ImportPage() {
  const { actor, loading } = useActor();
  const navigate = useNavigate();
  const [result, setResult] = useState<CsvImportResult | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && actor && actor.role !== "admin") {
    void navigate({ to: "/tableau" });
  }

  async function run(text: string) {
    setBusy(true);
    try {
      const res = await importCooperativesCsv({ data: { csv: text } });
      setResult(res);
      if (res.inserted) toast.success(`${res.inserted} coopérative(s) importée(s)`);
      if (res.errors.length) toast.error(`${res.errors.length} ligne(s) en erreur`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import impossible");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Import CSV"
        description="Colonnes obligatoires : name, city, region, sector. Optionnelles : province, address, lat, lng, phone, email, website, status, description, legal_status, country."
      />
      <Card className="p-5">
        <input
          type="file"
          accept=".csv,text/csv"
          className="block w-full text-sm"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = () => void run(String(reader.result ?? ""));
            reader.readAsText(f);
          }}
        />
        <a href="/sample-cooperatives.csv" download className="mt-3 inline-block text-sm text-primary">
          Télécharger un CSV modèle
        </a>
      </Card>
      {result ? (
        <Card className="mt-4 p-5">
          <p className="text-sm">
            Insertions : <span className="font-medium tabular-nums">{result.inserted}</span>
          </p>
          {result.errors.length ? (
            <ul className="mt-3 space-y-1 text-sm text-destructive">
              {result.errors.map((e, i) => (
                <li key={i}>Ligne {e.row} — {e.message}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Aucune erreur de validation.</p>
          )}
        </Card>
      ) : null}
    </div>
  );
}
