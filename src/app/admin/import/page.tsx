"use client";

import { useActionState } from "react";
import { importCooperativesCsv, type ImportResult } from "@/app/actions/import";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileWarning, CheckCircle2, Download } from "lucide-react";
import { useRef, useState } from "react";

const SAMPLE_CSV = `name,description,address,city,province,region,country,latitude,longitude,phone,email,website,sector,legalStatus,creationDate
Coopérative Nouvelle Terre,Coopérative agricole de la région,Douar Example,Kénitra,Kénitra,Rabat-Salé-Kénitra,Maroc,34.261,-6.5802,+212522000000,contact@nouvelleterre.ma,,Agriculture,Coopérative agricole,2021-03-15`;

export default function ImportPage() {
  const [state, formAction, pending] = useActionState<ImportResult, FormData>(importCooperativesCsv, null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modele_import_cooperatives.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import CSV</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Importez de nouvelles coopératives en masse à partir d'un fichier CSV.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Format attendu</CardTitle>
          <CardDescription>Colonnes requises : name, city, province, region, sector, phone, email, latitude, longitude</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" onClick={downloadSample}>
            <Download className="h-3.5 w-3.5" /> Télécharger un modèle CSV
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Téléverser un fichier</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <label
              htmlFor="csv-file"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors hover:bg-secondary/50"
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium">{fileName ?? "Cliquez pour sélectionner un fichier .csv"}</p>
              <p className="text-xs text-muted-foreground">ou glissez-déposez le fichier ici</p>
            </label>
            <input
              ref={fileRef}
              id="csv-file"
              name="file"
              type="file"
              accept=".csv"
              required
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
            <Button type="submit" disabled={pending || !fileName} className="w-full">
              {pending ? "Import en cours…" : "Importer les coopératives"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {state && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {state.success ? <CheckCircle2 className="h-4 w-4 text-success" /> : <FileWarning className="h-4 w-4 text-warning-foreground" />}
              Résultat de l'import
            </CardTitle>
            <CardDescription>
              <Badge variant="success" className="mr-2">{state.inserted} insérée(s)</Badge>
              {state.errors.length > 0 && <Badge variant="destructive">{state.errors.length} erreur(s)</Badge>}
            </CardDescription>
          </CardHeader>
          {state.errors.length > 0 && (
            <CardContent className="space-y-1.5">
              {state.errors.map((e, i) => (
                <p key={i} className="text-xs text-destructive">
                  {e.row > 0 ? `Ligne ${e.row} : ` : ""}{e.message}
                </p>
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
