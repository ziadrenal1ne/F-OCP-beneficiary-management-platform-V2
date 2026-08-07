import { db } from "@/db";
import { documents, cooperatives } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { reviewDocument } from "@/app/actions/coop";
import { Check, X, FolderOpen, FileText, FileSpreadsheet, Image as ImageIcon, Download } from "lucide-react";
import Link from "next/link";

const CATEGORY_LABEL: Record<string, string> = {
  REPORT: "Rapport", CONVENTION: "Convention", FINANCIAL: "Financier", LEGAL: "Légal", MEDIA: "Média", OTHER: "Autre",
};
const STATUS_VARIANT: Record<string, any> = { PENDING: "warning", APPROVED: "success", REJECTED: "destructive" };
const STATUS_LABEL: Record<string, string> = { PENDING: "En attente", APPROVED: "Approuvé", REJECTED: "Rejeté" };

function fileIcon(type: string) {
  if (type === "XLSX" || type === "CSV") return FileSpreadsheet;
  if (type === "JPG" || type === "PNG") return ImageIcon;
  return FileText;
}

export default async function AdminDocumentsPage() {
  const rows = await db
    .select().from(documents)
    .innerJoin(cooperatives, eq(documents.cooperativeId, cooperatives.id))
    .orderBy(desc(documents.uploadedAt));

  const all = rows.map((r) => ({ ...r.documents, cooperativeName: r.cooperatives.name }));
  const pending = all.filter((d) => d.status === "PENDING");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gestion documentaire</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{all.length} document(s) au total — {pending.length} en attente de validation</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">En attente ({pending.length})</TabsTrigger>
          <TabsTrigger value="all">Tous les documents ({all.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-2">
          {pending.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">Aucun document en attente.</p>}
          {pending.map((d) => {
            const Icon = fileIcon(d.fileType);
            return (
              <Card key={d.id} className="flex items-center justify-between gap-3 p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted"><Icon className="h-4 w-4" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.cooperativeName} · {CATEGORY_LABEL[d.category]} · {d.fileSizeKb} Ko</p>
                  </div>
                </div>
                <form action={reviewDocument} className="flex shrink-0 gap-1.5">
                  <input type="hidden" name="documentId" value={d.id} />
                  <Button type="submit" name="decision" value="APPROVED" size="sm" variant="outline" className="text-success border-success/40 hover:bg-success/10">
                    <Check className="h-3.5 w-3.5" /> Approuver
                  </Button>
                  <Button type="submit" name="decision" value="REJECTED" size="sm" variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10">
                    <X className="h-3.5 w-3.5" /> Rejeter
                  </Button>
                </form>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="all" className="space-y-2">
          {all.map((d) => {
            const Icon = fileIcon(d.fileType);
            return (
              <Card key={d.id} className="flex items-center justify-between gap-3 p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted"><Icon className="h-4 w-4" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.cooperativeName} · {CATEGORY_LABEL[d.category]} · v{d.version} · {new Date(d.uploadedAt).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT[d.status]} className="shrink-0">{STATUS_LABEL[d.status]}</Badge>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
