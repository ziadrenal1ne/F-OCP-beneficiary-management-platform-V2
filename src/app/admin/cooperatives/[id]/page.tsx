import { getCooperativeById } from "@/lib/data";
import { monthLabel } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EvolutionChart } from "@/components/charts/evolution-chart";
import { EsgLineChart } from "@/components/charts/esg-line-chart";
import { reviewReport, reviewDocument } from "@/app/actions/coop";
import {
  MapPin, Phone, Mail, Globe, Calendar, Building2, ArrowLeft, FileText,
  FolderOpen, ScrollText, Check, X, Download, Users,
} from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = { ACTIVE: "Active", PENDING: "En attente", SUSPENDED: "Suspendue" };
const STATUS_VARIANT: Record<string, any> = { ACTIVE: "success", PENDING: "warning", SUSPENDED: "destructive" };
const REPORT_STATUS_LABEL: Record<string, string> = { DRAFT: "Brouillon", SUBMITTED: "Soumis", APPROVED: "Approuvé", REJECTED: "Rejeté" };
const REPORT_STATUS_VARIANT: Record<string, any> = { DRAFT: "secondary", SUBMITTED: "warning", APPROVED: "success", REJECTED: "destructive" };
const DOC_STATUS_VARIANT: Record<string, any> = { PENDING: "warning", APPROVED: "success", REJECTED: "destructive" };
const CONV_STATUS_LABEL: Record<string, string> = { ACTIVE: "Active", EXPIRING: "Expire bientôt", EXPIRED: "Expirée", DRAFT: "Brouillon" };
const CONV_STATUS_VARIANT: Record<string, any> = { ACTIVE: "success", EXPIRING: "warning", EXPIRED: "destructive", DRAFT: "secondary" };

export default async function CooperativeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coop = await getCooperativeById(id);
  if (!coop) notFound();

  const evolutionData = coop.beneficiaryHistory.map((r) => ({
    label: monthLabel(r.month, r.year), women: r.women, men: r.men, total: r.women + r.men,
  }));
  const esgData = coop.esgHistory.map((e) => ({
    label: monthLabel(e.month, e.year), environmental: e.environmental, social: e.social, governance: e.governance,
  }));
  const latestBen = coop.beneficiaryHistory[coop.beneficiaryHistory.length - 1];

  return (
    <div className="space-y-6">
      <Link href="/admin/cooperatives" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Retour aux coopératives
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-white"
            style={{ background: coop.logoColor }}
          >
            {coop.name.split(" ").slice(-1)[0]?.[0] ?? "C"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">{coop.name}</h1>
              <Badge variant={STATUS_VARIANT[coop.status]}>{STATUS_LABEL[coop.status]}</Badge>
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {coop.city}, {coop.province} — {coop.region}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {coop.odds.map((o) => (
            <Badge key={o.number} variant="outline" style={{ borderColor: o.color, color: o.color }}>
              ODD {o.number}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Bénéficiaires directs</p>
          <p className="mt-1 font-mono text-xl font-semibold">{latestBen ? (latestBen.women + latestBen.men).toLocaleString("fr-FR") : "—"}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Bénéficiaires indirects</p>
          <p className="mt-1 font-mono text-xl font-semibold">{latestBen?.indirect.toLocaleString("fr-FR") ?? "—"}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Documents</p>
          <p className="mt-1 font-mono text-xl font-semibold">{coop.documents.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Conventions</p>
          <p className="mt-1 font-mono text-xl font-semibold">{coop.conventions.length}</p>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="reports">Rapports ({coop.reports.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({coop.documents.length})</TabsTrigger>
          <TabsTrigger value="conventions">Conventions ({coop.conventions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground leading-relaxed">{coop.description}</p>
                <div className="grid gap-3 sm:grid-cols-2 pt-2">
                  <InfoRow icon={Phone} label="Téléphone" value={coop.phone} />
                  <InfoRow icon={Mail} label="Email" value={coop.email} />
                  {coop.website && <InfoRow icon={Globe} label="Site web" value={coop.website} />}
                  <InfoRow icon={Calendar} label="Date de création" value={new Date(coop.creationDate).toLocaleDateString("fr-FR")} />
                  <InfoRow icon={Building2} label="Statut légal" value={coop.legalStatus} />
                  <InfoRow icon={MapPin} label="Adresse" value={coop.address} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Secteur</CardTitle></CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-sm">{coop.sector}</Badge>
                <div className="mt-4 space-y-1.5">
                  <p className="text-xs text-muted-foreground">ODD associés</p>
                  {coop.odds.map((o) => (
                    <div key={o.number} className="flex items-center gap-2 text-xs">
                      <span className="h-2 w-2 rounded-full" style={{ background: o.color }} />
                      ODD {o.number} — {o.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Évolution des bénéficiaires</CardTitle><CardDescription>12 derniers mois</CardDescription></CardHeader>
              <CardContent><EvolutionChart data={evolutionData} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Indicateurs ESG</CardTitle><CardDescription>Environnement, social, gouvernance</CardDescription></CardHeader>
              <CardContent><EsgLineChart data={esgData} /></CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-3">
          {coop.reports.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">Aucun rapport soumis.</p>}
          {coop.reports.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted"><FileText className="h-4 w-4" /></div>
                  <div>
                    <p className="text-sm font-medium">{monthLabel(r.month, r.year)}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-xl">{r.activitySummary}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Bénéficiaires atteints : {r.beneficiariesReached}</p>
                    {r.reviewComment && <p className="mt-1 text-xs italic text-muted-foreground">« {r.reviewComment} »</p>}
                  </div>
                </div>
                <Badge variant={REPORT_STATUS_VARIANT[r.status]}>{REPORT_STATUS_LABEL[r.status]}</Badge>
              </div>
              {r.status === "SUBMITTED" && (
                <form action={reviewReport} className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                  <input type="hidden" name="reportId" value={r.id} />
                  <input
                    name="comment"
                    placeholder="Commentaire (optionnel)"
                    className="h-8 flex-1 min-w-[180px] rounded-md border border-input bg-background px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                  />
                  <Button type="submit" name="decision" value="APPROVED" size="sm" variant="outline" className="text-success border-success/40 hover:bg-success/10">
                    <Check className="h-3.5 w-3.5" /> Approuver
                  </Button>
                  <Button type="submit" name="decision" value="REJECTED" size="sm" variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10">
                    <X className="h-3.5 w-3.5" /> Rejeter
                  </Button>
                </form>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="space-y-3">
          {coop.documents.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">Aucun document.</p>}
          {coop.documents.map((d) => (
            <Card key={d.id} className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted"><FolderOpen className="h-4 w-4" /></div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.fileType} · {d.fileSizeKb} Ko · v{d.version} · {new Date(d.uploadedAt).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={DOC_STATUS_VARIANT[d.status]}>{d.status === "PENDING" ? "En attente" : d.status === "APPROVED" ? "Approuvé" : "Rejeté"}</Badge>
                {d.status === "PENDING" && (
                  <form action={reviewDocument} className="flex gap-1">
                    <input type="hidden" name="documentId" value={d.id} />
                    <Button type="submit" name="decision" value="APPROVED" size="icon" variant="outline" className="h-7 w-7 text-success border-success/40"><Check className="h-3.5 w-3.5" /></Button>
                    <Button type="submit" name="decision" value="REJECTED" size="icon" variant="outline" className="h-7 w-7 text-destructive border-destructive/40"><X className="h-3.5 w-3.5" /></Button>
                  </form>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="conventions" className="space-y-3">
          {coop.conventions.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">Aucune convention.</p>}
          {coop.conventions.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted"><ScrollText className="h-4 w-4" /></div>
                  <div>
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">Réf. {c.reference} · Budget {c.budget.toLocaleString("fr-FR")} MAD</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.startDate).toLocaleDateString("fr-FR")} → {new Date(c.endDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <Badge variant={CONV_STATUS_VARIANT[c.status]}>{CONV_STATUS_LABEL[c.status]}</Badge>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
