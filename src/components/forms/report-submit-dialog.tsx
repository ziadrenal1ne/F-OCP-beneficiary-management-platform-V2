"use client";

import { useState, useTransition } from "react";
import { submitMonthlyReport } from "@/app/actions/coop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const MONTH_NAMES_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

export function ReportSubmitDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const now = new Date();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await submitMonthlyReport(formData);
        toast.success("Rapport soumis avec succès. L'administrateur a été notifié.");
        setOpen(false);
      } catch {
        toast.error("Une erreur est survenue lors de la soumission.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4" /> Soumettre un rapport</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Rapport mensuel</DialogTitle>
          <DialogDescription>Renseignez les informations pour {MONTH_NAMES_FR[now.getMonth()]} {now.getFullYear()}.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="month" value={now.getMonth() + 1} />
          <input type="hidden" name="year" value={now.getFullYear()} />

          <div className="space-y-1.5">
            <Label htmlFor="activitySummary">Résumé des activités</Label>
            <Textarea id="activitySummary" name="activitySummary" rows={3} required placeholder="Décrivez les activités menées ce mois-ci..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="beneficiariesReached">Bénéficiaires touchés ce mois</Label>
            <Input id="beneficiariesReached" name="beneficiariesReached" type="number" min={0} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="achievements">Réalisations</Label>
            <Textarea id="achievements" name="achievements" rows={2} required placeholder="Principales réalisations..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="challenges">Difficultés rencontrées</Label>
            <Textarea id="challenges" name="challenges" rows={2} required placeholder="Défis et obstacles..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="futureActions">Actions futures</Label>
            <Textarea id="futureActions" name="futureActions" rows={2} required placeholder="Actions prévues pour le mois prochain..." />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>{pending ? "Envoi en cours…" : "Soumettre le rapport"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
