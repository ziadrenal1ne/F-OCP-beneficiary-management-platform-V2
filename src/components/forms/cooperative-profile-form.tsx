"use client";

import { useState, useTransition } from "react";
import { updateCooperativeProfile } from "@/app/actions/coop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save } from "lucide-react";

type Coop = {
  name: string; description: string; address: string; city: string; province: string;
  region: string; country: string; phone: string; email: string; website: string | null;
  sector: string; legalStatus: string;
};

export function CooperativeProfileForm({ coop }: { coop: Coop }) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateCooperativeProfile(formData);
        toast.success("Profil mis à jour avec succès");
      } catch {
        toast.error("Une erreur est survenue");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name">Nom de la coopérative</Label>
          <Input id="name" name="name" defaultValue={coop.name} required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={coop.description} rows={4} required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" name="address" defaultValue={coop.address} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" name="city" defaultValue={coop.city} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="province">Province</Label>
          <Input id="province" name="province" defaultValue={coop.province} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="region">Région</Label>
          <Input id="region" name="region" defaultValue={coop.region} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Pays</Label>
          <Input id="country" name="country" defaultValue={coop.country} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" defaultValue={coop.phone} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={coop.email} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website">Site web</Label>
          <Input id="website" name="website" defaultValue={coop.website ?? ""} placeholder="https://" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sector">Secteur d'activité</Label>
          <Input id="sector" name="sector" defaultValue={coop.sector} required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="legalStatus">Statut juridique</Label>
          <Input id="legalStatus" name="legalStatus" defaultValue={coop.legalStatus} required />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        <Save className="h-4 w-4" /> {pending ? "Enregistrement…" : "Enregistrer les modifications"}
      </Button>
    </form>
  );
}
