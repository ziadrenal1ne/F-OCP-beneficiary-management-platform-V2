import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, FileType2 } from "lucide-react";
import { getAdminKpis } from "@/lib/data";

export default async function AdminExportsPage() {
  const kpis = await getAdminKpis();

  const exports = [
    {
      title: "Export CSV",
      description: "Liste complète des coopératives avec statistiques de bénéficiaires, format universel.",
      icon: FileText,
      href: "/api/export/csv",
      accent: "text-primary bg-primary/10",
    },
    {
      title: "Export Excel",
      description: "Classeur formaté avec en-têtes stylées, idéal pour l'analyse et le reporting interne.",
      icon: FileSpreadsheet,
      href: "/api/export/excel",
      accent: "text-success bg-success/10",
    },
    {
      title: "Export PDF",
      description: "Rapport de synthèse imprimable avec indicateurs clés et liste des coopératives.",
      icon: FileType2,
      href: "/api/export/pdf",
      accent: "text-gold-foreground bg-gold/15",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Exports</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Générez des exports à jour de vos {kpis.totalCooperatives} coopératives et {kpis.totalBeneficiaries.toLocaleString("fr-FR")} bénéficiaires directs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {exports.map((e) => (
          <Card key={e.title}>
            <CardHeader>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${e.accent}`}>
                <e.icon className="h-5 w-5" />
              </div>
              <CardTitle className="mt-2">{e.title}</CardTitle>
              <CardDescription>{e.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href={e.href} download>Télécharger</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
