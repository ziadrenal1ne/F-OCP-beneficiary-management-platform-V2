import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tooltipStyle } from "@/components/charts/chart-theme";
import { getCooperative, listOdds, sendAdminMessage, updateCooperative } from "@/lib/server/api";
import { COOP_STATUSES, REGIONS, SECTORS } from "@/lib/constants";
import { formatDate, formatNumber, monthLabel } from "@/lib/utils";
import { useActor } from "@/hooks/use-actor";
import type { Cooperative } from "@/lib/types";

export const Route = createFileRoute("/_app/cooperatives/$id")({ component: CoopProfilePage });

function CoopProfilePage() {
  const { id } = Route.useParams();
  const coopId = Number(id);
  const { actor } = useActor();
  const [pack, setPack] = useState<Awaited<ReturnType<typeof getCooperative>> | null>(null);
  const [odds, setOdds] = useState<{ code: number; nameFr: string }[]>([]);
  const [editing, setEditing] = useState(false);
  const [msgTitle, setMsgTitle] = useState("Message de l'administrateur");
  const [msgBody, setMsgBody] = useState("");

  useEffect(() => {
    void getCooperative({ data: { id: coopId } }).then(setPack);
    void listOdds().then(setOdds);
  }, [coopId]);

  if (!pack) return <p className="text-sm text-muted-foreground">Chargement du profil…</p>;
  const c = pack.cooperative;

  return (
    <div>
      <PageHeader
        eyebrow={`${c.city} · ${c.region}`}
        title={c.name}
        description={c.description}
        actions={
          <>
            <StatusBadge value={c.status} />
            <Button variant="outline" onClick={() => setEditing((v) => !v)}>
              {editing ? "Fermer" : "Modifier"}
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Bénéficiaires", formatNumber(c.totalDirect)],
          ["Femmes", formatNumber(c.women)],
          ["Jeunes", formatNumber(c.youth)],
          ["Indirects", formatNumber(c.indirect)],
        ].map(([k, v]) => (
          <Card key={k} className="p-4">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="font-display text-2xl tabular-nums">{v}</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="infos">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="infos">Informations</TabsTrigger>
          <TabsTrigger value="benef">Bénéficiaires</TabsTrigger>
          <TabsTrigger value="rapports">Rapports</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
          <TabsTrigger value="esg">ESG</TabsTrigger>
        </TabsList>
        <TabsContent value="infos">
          {editing ? (
            <EditForm
              cooperative={c}
              oddCodes={c.odds.map((o) => o.code)}
              catalog={odds}
              isAdmin={actor?.role === "admin"}
              onSaved={() => {
                setEditing(false);
                void getCooperative({ data: { id: coopId } }).then(setPack);
              }}
            />
          ) : (
            <Card className="p-5">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Item k="Adresse" v={c.address} />
                <Item k="Ville" v={c.city} />
                <Item k="Province" v={c.province} />
                <Item k="Région" v={c.region} />
                <Item k="Pays" v={c.country} />
                <Item k="GPS" v={`${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`} />
                <Item k="Téléphone" v={c.phone} />
                <Item k="E-mail" v={c.email} />
                <Item k="Site web" v={c.website || "—"} />
                <Item k="Secteur" v={c.sector} />
                <Item k="Statut juridique" v={c.legalStatus} />
                <Item k="Date de création" v={formatDate(c.createdDate)} />
              </dl>
              <div className="mt-4 flex flex-wrap gap-1">
                {c.odds.map((o) => (
                  <span key={o.id} className="rounded-full bg-muted px-2.5 py-1 text-xs">
                    ODD {o.code} · {o.shortName}
                  </span>
                ))}
              </div>
              {actor?.role === "admin" ? (
                <form
                  className="mt-6 space-y-2 rounded-xl bg-muted/60 p-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendAdminMessage({ data: { cooperativeId: c.id, title: msgTitle, body: msgBody } })
                      .then(() => {
                        toast.success("Message envoyé");
                        setMsgBody("");
                      })
                      .catch((err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur"));
                  }}
                >
                  <p className="text-sm font-medium">Envoyer un message à la coopérative</p>
                  <Input value={msgTitle} onChange={(e) => setMsgTitle(e.target.value)} />
                  <Textarea value={msgBody} onChange={(e) => setMsgBody(e.target.value)} required />
                  <Button type="submit" size="sm">Envoyer</Button>
                </form>
              ) : null}
            </Card>
          )}
        </TabsContent>
        <TabsContent value="benef">
          <Card>
            <CardHeader><CardTitle>Évolution</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pack.months.map((m) => ({ label: monthLabel(m.month), femmes: m.women, hommes: m.men }))}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="femmes" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="hommes" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.25} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rapports">
          <div className="space-y-2">
            {pack.reports.map((r) => (
              <Link key={r.id} to="/rapports/$id" params={{ id: String(r.id) }} className="flex items-center justify-between rounded-xl bg-card p-4 shadow-card">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
                </div>
                <StatusBadge value={r.status} />
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="docs">
          <div className="space-y-2">
            {pack.documents.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl bg-card p-4 shadow-card">
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.category} · v{d.version}</p>
                </div>
                <StatusBadge value={d.status} />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="esg">
          {pack.esg ? (
            <Card className="p-5">
              <dl className="grid gap-4 sm:grid-cols-3">
                <Item k="Score environnemental" v={pack.esg.environmentalScore.toFixed(1)} />
                <Item k="Score social" v={pack.esg.socialScore.toFixed(1)} />
                <Item k="Score gouvernance" v={pack.esg.governanceScore.toFixed(1)} />
                <Item k="Eau économisée" v={`${formatNumber(pack.esg.waterSavedM3)} m³`} />
                <Item k="Énergie renouvelable" v={`${formatNumber(pack.esg.renewableEnergyKwh)} kWh`} />
                <Item k="Emplois créés" v={formatNumber(pack.esg.jobsCreated)} />
                <Item k="Heures de formation" v={formatNumber(pack.esg.trainingHours)} />
              </dl>
              <p className="mt-4 text-sm text-muted-foreground">{pack.esg.notes}</p>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">Pas d'indicateurs ESG.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="text-sm">{v}</dd>
    </div>
  );
}

function EditForm({
  cooperative,
  oddCodes,
  catalog,
  isAdmin,
  onSaved,
}: {
  cooperative: Cooperative;
  oddCodes: number[];
  catalog: { code: number; nameFr: string }[];
  isAdmin: boolean;
  onSaved: () => void;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: cooperative.name,
      description: cooperative.description,
      address: cooperative.address,
      city: cooperative.city,
      province: cooperative.province,
      region: cooperative.region,
      country: cooperative.country,
      lat: cooperative.lat,
      lng: cooperative.lng,
      phone: cooperative.phone,
      email: cooperative.email,
      website: cooperative.website,
      sector: cooperative.sector,
      legalStatus: cooperative.legalStatus,
      createdDate: cooperative.createdDate ?? "",
      status: cooperative.status,
    },
  });
  const [selectedOdds, setSelectedOdds] = useState<number[]>(oddCodes);
  const [sector, setSector] = useState(cooperative.sector);
  const [region, setRegion] = useState(cooperative.region);
  const [status, setStatus] = useState(cooperative.status);

  return (
    <form
      className="grid gap-4 rounded-2xl bg-card p-5 shadow-card sm:grid-cols-2"
      onSubmit={handleSubmit((values) => {
        void updateCooperative({
          data: {
            id: cooperative.id,
            ...values,
            lat: Number(values.lat),
            lng: Number(values.lng),
            createdDate: values.createdDate || null,
            sector,
            region,
            status,
            oddCodes: selectedOdds,
          },
        })
          .then(() => {
            toast.success("Profil enregistré");
            onSaved();
          })
          .catch((err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur"));
      })}
    >
      <Field label="Nom"><Input {...register("name", { required: true })} /></Field>
      <Field label="E-mail"><Input type="email" {...register("email")} /></Field>
      <div className="sm:col-span-2">
        <Field label="Description"><Textarea {...register("description")} /></Field>
      </div>
      <Field label="Adresse"><Input {...register("address")} /></Field>
      <Field label="Ville"><Input {...register("city")} /></Field>
      <Field label="Province"><Input {...register("province")} /></Field>
      <Field label="Pays"><Input {...register("country")} /></Field>
      <Field label="Région">
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Secteur">
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {SECTORS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Latitude"><Input type="number" step="0.0001" {...register("lat", { valueAsNumber: true })} /></Field>
      <Field label="Longitude"><Input type="number" step="0.0001" {...register("lng", { valueAsNumber: true })} /></Field>
      <Field label="Téléphone"><Input {...register("phone")} /></Field>
      <Field label="Site web"><Input {...register("website")} /></Field>
      <Field label="Statut juridique"><Input {...register("legalStatus")} /></Field>
      <Field label="Date de création"><Input type="date" {...register("createdDate")} /></Field>
      {isAdmin ? (
        <Field label="Statut">
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {COOP_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      ) : null}
      <div className="sm:col-span-2">
        <Label>Objectifs de développement durable</Label>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {catalog.map((o) => (
            <label key={o.code} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedOdds.includes(o.code)}
                onCheckedChange={(ck) => {
                  setSelectedOdds((prev) => (ck ? [...prev, o.code] : prev.filter((x) => x !== o.code)));
                }}
              />
              ODD {o.code} — {o.nameFr}
            </label>
          ))}
        </div>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
