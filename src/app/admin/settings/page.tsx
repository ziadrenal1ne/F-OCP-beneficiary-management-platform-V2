import { getSession } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default async function AdminSettingsPage() {
  const session = await getSession();
  const initials = session!.name.split(" ").map((s) => s[0]).slice(0, 2).join("");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gérez votre profil et vos préférences de plateforme.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Profil administrateur</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16"><AvatarFallback className="bg-primary text-primary-foreground text-lg">{initials}</AvatarFallback></Avatar>
            <div>
              <p className="font-medium">{session?.name}</p>
              <p className="text-sm text-muted-foreground">{session?.email}</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Nom complet</Label><Input defaultValue={session?.name} disabled /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input defaultValue={session?.email} disabled /></div>
          </div>
          <p className="text-xs text-muted-foreground">La modification du profil administrateur est désactivée dans cet environnement de démonstration.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Préférences de notification</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Rapport soumis", desc: "Être notifié lorsqu'une coopérative soumet un rapport mensuel" },
            { label: "Document en attente", desc: "Être notifié lorsqu'un document nécessite une validation" },
            { label: "Convention arrivant à échéance", desc: "Alerte 60 jours avant expiration d'une convention" },
          ].map((p) => (
            <div key={p.label} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{p.label}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Apparence</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Mode sombre</p>
            <p className="text-xs text-muted-foreground">Basculez le thème depuis l'icône en haut de l'écran</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
