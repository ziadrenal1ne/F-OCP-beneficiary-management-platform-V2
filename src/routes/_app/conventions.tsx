import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listConventions, listCooperatives, saveConvention } from "@/lib/server/api";
import { formatDate, formatNumber } from "@/lib/utils";
import { useActor } from "@/hooks/use-actor";
import type { Convention } from "@/lib/types";

export const Route = createFileRoute("/_app/conventions")({ component: ConventionsPage });

function ConventionsPage() {
  const { actor } = useActor();
  const [rows, setRows] = useState<Convention[]>([]);
  const [open, setOpen] = useState(false);
  const [coops, setCoops] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    cooperativeId: 0,
    title: "",
    partner: "Fondation OCP",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
    amount: 100000,
    description: "",
  });

  function reload() {
    void listConventions().then(setRows);
  }
  useEffect(() => {
    reload();
    void listCooperatives({ data: {} }).then((c) => {
      setCoops(c.map((x) => ({ id: x.id, name: x.name })));
      setForm((f) => ({ ...f, cooperativeId: c[0]?.id ?? 0 }));
    });
  }, []);

  return (
    <div>
      <PageHeader
        title="Conventions"
        description="Partenariats, montants et échéances."
        actions={
          actor?.role === "admin" ? (
            <Button onClick={() => setOpen(true)}>Nouvelle convention</Button>
          ) : null
        }
      />
      <div className="overflow-x-auto rounded-2xl bg-card shadow-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted-foreground">
            <tr>
              {["Titre", "Coopérative", "Partenaire", "Montant", "Fin", "Statut"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{c.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.cooperativeName}</td>
                <td className="px-4 py-3">{c.partner}</td>
                <td className="px-4 py-3 tabular-nums">{formatNumber(c.amount)} MAD</td>
                <td className="px-4 py-3">{formatDate(c.endDate)}</td>
                <td className="px-4 py-3"><StatusBadge value={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle convention</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void saveConvention({ data: form })
                .then(() => {
                  toast.success("Convention enregistrée");
                  setOpen(false);
                  reload();
                })
                .catch((err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur"));
            }}
          >
            <div className="space-y-1.5">
              <Label>Coopérative</Label>
              <Select value={String(form.cooperativeId)} onValueChange={(v) => setForm((f) => ({ ...f, cooperativeId: Number(v) }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {coops.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Titre</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Partenaire</Label>
              <Input value={form.partner} onChange={(e) => setForm((f) => ({ ...f, partner: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label>Début</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Fin</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Montant (MAD)</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <Button type="submit">Enregistrer</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
