import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getDocumentContent,
  listCooperatives,
  listDocuments,
  reviewDocument,
  uploadDocument,
} from "@/lib/server/api";
import { DOCUMENT_CATEGORIES, MAX_UPLOAD_BYTES } from "@/lib/constants";
import { formatDate, formatNumber } from "@/lib/utils";
import { useActor } from "@/hooks/use-actor";
import type { DocumentRecord } from "@/lib/types";

export const Route = createFileRoute("/_app/documents")({ component: DocumentsPage });

function DocumentsPage() {
  const { actor } = useActor();
  const [rows, setRows] = useState<DocumentRecord[]>([]);
  const [coops, setCoops] = useState<{ id: number; name: string }[]>([]);
  const [cooperativeId, setCooperativeId] = useState<number | null>(null);
  const [category, setCategory] = useState<string>(DOCUMENT_CATEGORIES[0]);
  const [preview, setPreview] = useState<{ name: string; mimeType: string; url: string } | null>(null);

  function reload() {
    void listDocuments().then(setRows);
  }

  useEffect(() => {
    reload();
    void listCooperatives({ data: {} }).then((c) => {
      setCoops(c.map((x) => ({ id: x.id, name: x.name })));
      setCooperativeId(actor?.cooperativeId ?? c[0]?.id ?? null);
    });
  }, [actor?.cooperativeId]);

  async function onFile(file: File) {
    if (!cooperativeId) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Fichier trop volumineux (max 1,5 Mo)");
      return;
    }
    const contentBase64 = await fileToBase64(file);
    try {
      await uploadDocument({
        data: {
          cooperativeId,
          name: file.name,
          category,
          mimeType: file.type || "application/octet-stream",
          contentBase64,
          sizeBytes: file.size,
        },
      });
      toast.success("Document téléversé");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Téléversement impossible");
    }
  }

  async function openDoc(id: number) {
    try {
      const doc = await getDocumentContent({ data: { id } });
      if (!doc.contentBase64) {
        toast.message("Aperçu indisponible", { description: "Ce document de démonstration n'a pas de fichier joint." });
        return;
      }
      const url = `data:${doc.mimeType};base64,${doc.contentBase64}`;
      setPreview({ name: doc.name, mimeType: doc.mimeType, url });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lecture impossible");
    }
  }

  return (
    <div>
      <PageHeader title="Documents" description="PDF, CSV, Excel et images — versioning, statut et aperçu." />
      <form className="mb-6 grid gap-3 rounded-2xl bg-card p-5 shadow-card sm:grid-cols-3">
        {actor?.role === "admin" ? (
          <div className="space-y-1.5">
            <Label>Coopérative</Label>
            <Select value={cooperativeId ? String(cooperativeId) : ""} onValueChange={(v) => setCooperativeId(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {coops.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="space-y-1.5">
          <Label>Catégorie</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DOCUMENT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Fichier</Label>
          <Input
            type="file"
            accept=".pdf,.csv,.xls,.xlsx,image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
          />
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl bg-card shadow-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted-foreground">
            <tr>
              {["Nom", "Coopérative", "Catégorie", "Version", "Statut", "Date", ""].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <button type="button" className="text-left font-medium hover:underline" onClick={() => void openDoc(d.id)}>
                    {d.name}
                  </button>
                  <p className="text-[11px] text-muted-foreground">{formatNumber(d.sizeBytes)} octets</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{d.cooperativeName}</td>
                <td className="px-4 py-3">{d.category}</td>
                <td className="px-4 py-3 tabular-nums">v{d.version}</td>
                <td className="px-4 py-3"><StatusBadge value={d.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(d.uploadedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => void openDoc(d.id)}>Aperçu</Button>
                    {actor?.role === "admin" && d.status === "pending" ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => void reviewDocument({ data: { id: d.id, status: "approved" } }).then(reload)}>
                          Valider
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => void reviewDocument({ data: { id: d.id, status: "rejected" } }).then(reload)}>
                          Rejeter
                        </Button>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {preview ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4" onClick={() => setPreview(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-card p-4 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-medium">{preview.name}</p>
              <div className="flex gap-2">
                <a href={preview.url} download={preview.name} className="text-sm text-primary">Télécharger</a>
                <Button size="sm" variant="ghost" onClick={() => setPreview(null)}>Fermer</Button>
              </div>
            </div>
            {preview.mimeType.startsWith("image/") ? (
              <img src={preview.url} alt="" className="max-h-[70vh] w-full object-contain" />
            ) : preview.mimeType === "application/pdf" ? (
              <iframe title={preview.name} src={preview.url} className="h-[70vh] w-full rounded-lg bg-muted" />
            ) : (
              <p className="text-sm text-muted-foreground">Aperçu non disponible pour ce type — utilisez Télécharger.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = String(reader.result ?? "");
      const comma = res.indexOf(",");
      resolve(comma >= 0 ? res.slice(comma + 1) : res);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
