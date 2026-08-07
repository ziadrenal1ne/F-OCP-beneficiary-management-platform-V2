import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default async function CooperativeSettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gérez vos préférences de compte.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compte</CardTitle>
          <CardDescription>Informations liées à votre compte utilisateur.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label>Nom</Label>
            <Input defaultValue={session.name} disabled />
          </div>
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <Input defaultValue={session.email} disabled />
          </div>
          <p className="text-xs text-muted-foreground">Pour modifier vos informations de compte, contactez l'administrateur de la plateforme.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choisissez les alertes que vous souhaitez recevoir.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Validation de rapport", desc: "Être notifié lorsqu'un rapport est approuvé ou rejeté" },
            { label: "Rapport manquant", desc: "Rappel si le rapport mensuel n'a pas été soumis" },
            { label: "Convention à échéance", desc: "Alerte 60 jours avant l'expiration d'une convention" },
            { label: "Messages administratifs", desc: "Recevoir les messages de l'administrateur" },
          ].map((s, i) => (
            <div key={i}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
              {i < 3 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
