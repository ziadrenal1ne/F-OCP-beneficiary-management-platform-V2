import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { useActor } from "@/hooks/use-actor";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { DEMO_ACCOUNTS } from "@/lib/constants";

export const Route = createFileRoute("/_app/parametres")({ component: SettingsPage });

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { actor } = useActor();
  const user = useCurrentUser();

  return (
    <div>
      <PageHeader title="Paramètres" description="Compte, apparence et informations de la plateforme." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 space-y-4">
          <h2 className="font-display text-lg">Profil</h2>
          <p className="text-sm"><span className="text-muted-foreground">Nom · </span>{actor?.name ?? user?.displayName}</p>
          <p className="text-sm"><span className="text-muted-foreground">E-mail · </span>{actor?.email ?? user?.primaryEmail}</p>
          <p className="text-sm">
            <span className="text-muted-foreground">Rôle · </span>
            {actor?.role === "admin" ? "Administrateur" : "Représentant de coopérative"}
          </p>
        </Card>
        <Card className="p-5 space-y-4">
          <h2 className="font-display text-lg">Apparence</h2>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark">Mode sombre</Label>
            <Switch id="dark" checked={theme === "dark"} onCheckedChange={toggle} />
          </div>
          <p className="text-sm text-muted-foreground">
            Interface institutionnelle, lisible de jour comme de nuit.
          </p>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-display text-lg">Comptes de démonstration</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.email}>
                <span className="font-medium">{a.role}</span>
                <span className="text-muted-foreground"> — {a.email} / {a.password}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
