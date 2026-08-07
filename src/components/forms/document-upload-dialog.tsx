"use client";

import { useState, useTransition, useRef } from "react";
import { uploadDocument } from "@/app/actions/coop";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, FileUp } from "lucide-react";

const CATEGORIES = [
  { value: "REPORT", label: "Rapport" },
  { value: "CONVENTION", label: "Convention" },
  { value: "FINANCIAL", label: "Financier" },
  { value: "LEGAL", label: "Juridique" },
  { value: "MEDIA", label: "Média" },
  { value: "OTHER", label: "Autre" },
];

export function DocumentUploadDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await uploadDocument(formData);
        toast.success("Document téléversé avec succès. En attente de validation.");
        setOpen(false);
        setFileName(null);
        formRef.current?.reset();
      } catch {
        toast.error("Merci de sélectionner un fichier valide.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Upload className="h-4 w-4" /> Téléverser un document</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Téléverser un document</DialogTitle>
          <DialogDescription>PDF, CSV, Excel ou image. Le document sera examiné par l'administrateur.</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="category">Catégorie</Label>
            <Select name="category" defaultValue="OTHER">
              <SelectTrigger id="category"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="file">Fichier</Label>
            <label
              htmlFor="file"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:bg-secondary/50"
            >
              <FileUp className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{fileName ?? "Cliquez pour choisir un fichier"}</span>
              <input
                id="file"
                name="file"
                type="file"
                required
                className="hidden"
                accept=".pdf,.csv,.xlsx,.xls,.jpg,.jpeg,.png"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>{pending ? "Téléversement…" : "Téléverser"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
