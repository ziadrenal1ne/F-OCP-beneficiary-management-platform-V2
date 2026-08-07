"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Leaf, ShieldCheck, MapPinned, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, null);
  const [demo, setDemo] = useState<"admin" | "coop" | null>(null);

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[1.05fr_1fr] bg-background">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-sidebar text-sidebar-foreground p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, currentColor 1px, transparent 1px), radial-gradient(circle at 60% 65%, currentColor 1px, transparent 1px)",
            backgroundSize: "34px 34px, 46px 46px",
          }}
        />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--sidebar-primary), transparent 70%)" }}
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-semibold">
            F
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">Fondation OCP</p>
            <p className="text-xs text-sidebar-foreground/60">Direction de la Transformation Digitale</p>
          </div>
        </div>

        <div className="relative max-w-md space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-sidebar-primary">
            Axe Éco-Social
          </p>
          <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-balance">
            Une vision centralisée de 1 700 coopératives, partout au Maroc.
          </h1>
          <p className="text-sidebar-foreground/70 leading-relaxed">
            Bénéficiaires, ODD, indicateurs ESG, conventions et rapports mensuels —
            réunis dans une seule plateforme pensée pour l'impact.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { icon: MapPinned, label: "Cartographie live" },
              { icon: Sprout, label: "17 ODD suivis" },
              { icon: ShieldCheck, label: "Validation admin" },
            ].map((f, i) => (
              <div key={i} className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
                <f.icon className="h-4 w-4 text-sidebar-primary mb-2" />
                <p className="text-xs text-sidebar-foreground/80 leading-tight">{f.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-sidebar-foreground/40">
          © {new Date().getFullYear()} Fondation OCP — Plateforme interne, usage restreint.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">F</div>
            <span className="font-semibold tracking-tight">Fondation OCP</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Bienvenue</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Connectez-vous pour accéder à la plateforme de l'Axe Éco-Social.
          </p>

          <form action={formAction} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nom@focp.local"
                required
                defaultValue={demo === "admin" ? "admin@focp.local" : demo === "coop" ? "cooperative@focp.local" : ""}
                key={demo}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                defaultValue={demo === "admin" ? "admin123" : demo === "coop" ? "cooperative123" : ""}
                key={demo + "-pw"}
              />
            </div>

            {state?.error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={pending}>
              {pending ? "Connexion en cours…" : "Se connecter"}
              {!pending && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              Comptes de démonstration
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDemo("admin")}
                className="rounded-lg border p-3 text-left transition-colors hover:bg-secondary"
              >
                <p className="text-xs font-medium">Administrateur</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">admin@focp.local</p>
              </button>
              <button
                type="button"
                onClick={() => setDemo("coop")}
                className="rounded-lg border p-3 text-left transition-colors hover:bg-secondary"
              >
                <p className="text-xs font-medium">Coopérative</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">cooperative@focp.local</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
