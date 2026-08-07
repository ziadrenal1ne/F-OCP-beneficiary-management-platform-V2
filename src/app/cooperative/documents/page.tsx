import { getSession } from "@/lib/auth";
import { getCooperativeById } from "@/lib/data";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentUploadDialog } from "@/components/forms/document-upload-dialog";
import { FileText, FileSpreadsheet, Image as ImageIcon, File, Download } from "lucide-react";

const STATUS_LABEL: Record<string, string> = { APPROVED: "Approuvé", PENDING: "En attente", REJECTED: "Rejeté" };
const STATUS_VARIANT: Record<string, any> = { APPROVED: "success", PENDING: "warning", REJECTED: "destructive" };
const CATEGORY_LABEL: Record<string, string> = { REPORT: "Rapport", CONVENTION: "Convention", FINANCIAL: "Financier", LEGAL: "Juridique", MEDIA: "Média", OTHER: "Autre" };

function fileIcon(type: string) {
  const t = type.toUpperCase();
  if (t === "PDF") return FileText;
  if (t === "XLSX" || t === "CSV" || t === "XLS") return FileSpreadsheet;
  if (["JPG", "JPEG", "PNG"].includes(t)) return ImageIcon;
  return File;
}

export default async function CooperativeDocumentsPage() {
  const session = await getSession();
  if (!session?.cooperativeId) redirect("/login");
  const coop = await getCooperativeById(session.cooperativeId);
  if (!coop) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{coop.documents.length} document(s) au total</p>
        </div>
        <DocumentUploadDialog />
      </div>

      {coop.documents.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">Aucun document téléversé pour le moment.</CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coop.documents.map((d) => {
            const Icon = fileIcon(d.fileType);
            return (
              <Card key={d.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted"><Icon className="h-5 w-5" /></div>
                  <Badge variant={STATUS_VARIANT[d.status]}>{STATUS_LABEL[d.status]}</Badge>
                </div>
                <p className="mt-3 text-sm font-medium truncate">{d.name}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{CATEGORY_LABEL[d.category]}</span>·<span>{(d.fileSizeKb / 1024).toFixed(1)} Mo</span>·<span>v{d.version}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground/70">{new Date(d.uploadedAt).toLocaleDateString("fr-FR")}</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
