"use client";

import { useState, useTransition } from "react";
import { updateBeneficiaryRecord } from "@/app/actions/coop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

const MONTH_NAMES_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

type Record_ = {
  month: number; year: number; women: number; men: number; youth: number;
  adults: number; children: number; disabled: number; indirect: number;
};

export function BeneficiaryEditDialog({ record }: { record: Record_ }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateBeneficiaryRecord(formData);
        toast.success("Statistiques mises à jour");
        setOpen(false);
      } catch {
        toast.error("Une erreur est survenue");
      }
    });
  }

  const fields: { name: keyof Record_; label: string }[] = [
    { name: "women", label: "Femmes" },
    { name: "men", label: "Hommes" },
    { name: "youth", label: "Jeunes" },
    { name: "adults", label: "Adultes" },
    { name: "children", label: "Enfants" },
    { name: "disabled", label: "Personnes en situation de handicap" },
    { name: "indirect", label: "Bénéficiaires indirects" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Pencil className="h-3.5 w-3.5" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{MONTH_NAMES_FR[record.month - 1]} {record.year}</DialogTitle>
          <DialogDescription>Modifier les statistiques de bénéficiaires pour cette période.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="month" value={record.month} />
          <input type="hidden" name="year" value={record.year} />
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label htmlFor={f.name}>{f.label}</Label>
                <Input id={f.name} name={f.name} type="number" min={0} defaultValue={record[f.name]} required />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
