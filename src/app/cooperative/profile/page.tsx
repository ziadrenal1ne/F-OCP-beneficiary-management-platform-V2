import { getSession } from "@/lib/auth";
import { getCooperativeById } from "@/lib/data";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CooperativeProfileForm } from "@/components/forms/cooperative-profile-form";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

export default async function CooperativeProfilePage() {
  const session = await getSession();
  if (!session?.cooperativeId) redirect("/login");
  const coop = await getCooperativeById(session.cooperativeId);
  if (!coop) redirect("/login");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profil de la coopérative</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gérez les informations générales de votre coopérative.</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-white"
            style={{ background: coop.logoColor }}
          >
            {coop.name.split(" ").slice(-1)[0]?.[0] ?? "C"}
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg">{coop.name}</CardTitle>
            <CardDescription className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {coop.city}, {coop.region}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Créée le {new Date(coop.creationDate).toLocaleDateString("fr-FR")}</span>
              <Badge variant={coop.status === "ACTIVE" ? "success" : coop.status === "PENDING" ? "warning" : "destructive"}>
                {coop.status === "ACTIVE" ? "Active" : coop.status === "PENDING" ? "En attente" : "Suspendue"}
              </Badge>
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>Ces informations sont visibles par l'administrateur de la Fondation OCP.</CardDescription>
        </CardHeader>
        <CardContent>
          <CooperativeProfileForm coop={coop} />
        </CardContent>
      </Card>
    </div>
  );
}
