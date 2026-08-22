import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME, DEMO_ACCOUNTS, ORG_NAME } from "@/lib/constants";
import { bootstrapDemo } from "@/lib/server/bootstrap";

export function LoginScreen() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@focp.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void bootstrapDemo()
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, []);

  if (!isPending && user) {
    void navigate({ to: "/tableau" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await authClient.signIn.email({ email, password, callbackURL: "/tableau" });
    if (err) {
      setError(err.message ?? "Identifiants incorrects");
      setBusy(false);
      return;
    }
    window.location.href = "/tableau";
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_55%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{ORG_NAME}</p>
          <h1 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-foreground xl:text-5xl">
            Plateforme de gestion des bénéficiaires
            <span className="block text-primary">Axe Éco-Social</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Centralisez les coopératives, les statistiques de bénéficiaires, les ODD, les conventions et le
            cycle de validation des rapports mensuels.
          </p>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              ["1 700+", "coopératives cibles"],
              ["12", "régions"],
              ["17", "ODD suivis"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="font-display text-2xl font-medium tabular-nums">{k}</dt>
                <dd className="text-xs text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{ORG_NAME}</p>
            <h1 className="mt-2 font-display text-3xl font-medium">{APP_NAME}</h1>
          </div>
          <div className="rounded-2xl bg-card p-6 shadow-card sm:p-8">
            <h2 className="font-display text-xl font-medium">Connexion</h2>
            <p className="mt-1 text-sm text-muted-foreground">Espace réservé aux équipes de la Fondation.</p>
            {!ready ? (
              <p className="mt-4 text-sm text-muted-foreground">Préparation de l'espace de démonstration…</p>
            ) : null}

            {authEnabled ? (
              <form className="mt-6 space-y-4" onSubmit={(e) => void onSubmit(e)}>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={busy || !ready}>
                  {busy ? "Connexion…" : "Se connecter"}
                </Button>
              </form>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">La connexion est désactivée.</p>
            )}

            {authEnabled && GROK_PROVIDERS.length > 0 ? (
              <div className="mt-5">
                <p className="mb-2 text-center text-xs text-muted-foreground">ou continuer avec</p>
                <div className="grid gap-2">
                  {GROK_PROVIDERS.map((p) => (
                    <Button
                      key={p.providerId}
                      type="button"
                      variant="outline"
                      onClick={() => void signIn(p.providerId, { callbackURL: "/tableau" })}
                    >
                      Continuer avec {p.label}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 space-y-2 rounded-xl bg-muted/70 p-3">
              <p className="text-xs font-medium text-muted-foreground">Comptes de démonstration</p>
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  className="flex w-full flex-col rounded-lg bg-card px-3 py-2 text-left text-xs shadow-card hover:bg-accent"
                  onClick={() => {
                    setEmail(a.email);
                    setPassword(a.password);
                  }}
                >
                  <span className="font-medium text-foreground">{a.role}</span>
                  <span className="text-muted-foreground">
                    {a.email} · {a.password}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
