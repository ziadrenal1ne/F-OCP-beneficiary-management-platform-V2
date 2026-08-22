import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listCooperatives, saveReport } from "@/lib/server/api";
import { useActor } from "@/hooks/use-actor";

export const Route = createFileRoute("/_app/rapports/nouveau")({ component: NewReportPage });

function NewReportPage() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const now = new Date();
  const [cooperativeId, setCooperativeId] = useState<number | null>(null);
  const [coops, setCoops] = useState<{ id: number; name: string }[]>([]);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [title, setTitle] = useState(`Rapport ${now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`);
  const [activitySummary, setActivitySummary] = useState("");
  const [achievements, setAchievements] = useState("");
  const [challenges, setChallenges] = useState("");
  const [futureActions, setFutureActions] = useState("");
  const [women, setWomen] = useState(0);
  const [men, setMen] = useState(0);
  const [youth, setYouth] = useState(0);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [disabled, setDisabled] = useState(0);
  const [indirect, setIndirect] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void listCooperatives({ data: {} }).then((rows) => {
      setCoops(rows.map((c) => ({ id: c.id, name: c.name })));
      if (actor?.cooperativeId) setCooperativeId(actor.cooperativeId);
      else if (rows[0]) setCooperativeId(rows[0].id);
    });
  }, [actor?.cooperativeId]);

  async function save(submit: boolean) {
    if (!cooperativeId) return;
    setBusy(true);
    try {
      const res = await saveReport({
        data: {
          cooperativeId,
          year,
          month,
          title,
          activitySummary,
          achievements,
          challenges,
          futureActions,
          women,
          men,
          youth,
          adults,
          children,
          disabled,
          indirect,
          submit,
        },
      });
      toast.success(submit ? "Rapport soumis pour validation" : "Brouillon enregistré");
      void navigate({ to: "/rapports/$id", params: { id: String(res.id) } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader title="Nouveau rapport mensuel" description="Renseignez l'activité, les effectifs et les perspectives." />
      <form className="grid gap-4 lg:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4 lg:col-span-2">
          <Field label="Titre"><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></Field>
          {actor?.role === "admin" ? (
            <Field label="Coopérative">
              <Select value={cooperativeId ? String(cooperativeId) : ""} onValueChange={(v) => setCooperativeId(Number(v))}>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>
                  {coops.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Année"><Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} /></Field>
            <Field label="Mois"><Input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} /></Field>
          </div>
          <Field label="Synthèse d'activité"><Textarea value={activitySummary} onChange={(e) => setActivitySummary(e.target.value)} /></Field>
          <Field label="Réalisations"><Textarea value={achievements} onChange={(e) => setAchievements(e.target.value)} /></Field>
          <Field label="Difficultés"><Textarea value={challenges} onChange={(e) => setChallenges(e.target.value)} /></Field>
          <Field label="Actions à venir"><Textarea value={futureActions} onChange={(e) => setFutureActions(e.target.value)} /></Field>
        </div>
        <div className="space-y-3 rounded-2xl bg-card p-5 shadow-card">
          <p className="text-sm font-medium">Effectifs du mois</p>
          <Num label="Femmes" value={women} set={setWomen} />
          <Num label="Hommes" value={men} set={setMen} />
          <Num label="Jeunes" value={youth} set={setYouth} />
          <Num label="Adultes" value={adults} set={setAdults} />
          <Num label="Enfants" value={children} set={setChildren} />
          <Num label="Handicap" value={disabled} set={setDisabled} />
          <Num label="Indirects" value={indirect} set={setIndirect} />
          <div className="flex flex-col gap-2 pt-2">
            <Button disabled={busy} onClick={() => void save(false)} variant="outline">Enregistrer le brouillon</Button>
            <Button disabled={busy} onClick={() => void save(true)}>Soumettre à l'administrateur</Button>
          </div>
        </div>
      </form>
    </div>
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
function Num({ label, value, set }: { label: string; value: number; set: (n: number) => void }) {
  return (
    <Field label={label}>
      <Input type="number" min={0} value={value} onChange={(e) => set(Number(e.target.value))} />
    </Field>
  );
}
