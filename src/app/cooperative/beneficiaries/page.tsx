import { getSession } from "@/lib/auth";
import { getCooperativeById, monthLabel } from "@/lib/data";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { GenderBarChart } from "@/components/charts/gender-bar-chart";
import { StatCard } from "@/components/shell/stat-card";
import { Users, Baby, Accessibility, UserPlus } from "lucide-react";
import { BeneficiaryEditDialog } from "@/components/forms/beneficiary-edit-dialog";

export default async function BeneficiariesPage() {
  const session = await getSession();
  if (!session?.cooperativeId) redirect("/login");
  const coop = await getCooperativeById(session.cooperativeId);
  if (!coop) redirect("/login");

  const history = [...coop.beneficiaryHistory].reverse();
  const latest = coop.beneficiaryHistory[coop.beneficiaryHistory.length - 1];
  const chartData = coop.beneficiaryHistory.slice(-8).map((b) => ({ label: monthLabel(b.month, b.year), women: b.women, men: b.men }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bénéficiaires</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Suivez et mettez à jour les statistiques mensuelles de vos bénéficiaires.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Directs (ce mois)" value={((latest?.women ?? 0) + (latest?.men ?? 0)).toLocaleString("fr-FR")} icon={Users} accent="primary" />
        <StatCard label="Jeunes" value={(latest?.youth ?? 0).toLocaleString("fr-FR")} icon={Baby} accent="gold" />
        <StatCard label="En situation de handicap" value={latest?.disabled ?? 0} icon={Accessibility} />
        <StatCard label="Indirects" value={(latest?.indirect ?? 0).toLocaleString("fr-FR")} icon={UserPlus} accent="success" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Répartition femmes / hommes</CardTitle>
          <CardDescription>8 derniers mois</CardDescription>
        </CardHeader>
        <CardContent><GenderBarChart data={chartData} /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique mensuel</CardTitle>
          <CardDescription>Cliquez sur l'icône de modification pour mettre à jour un mois.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Femmes</TableHead>
                <TableHead>Hommes</TableHead>
                <TableHead>Jeunes</TableHead>
                <TableHead>Enfants</TableHead>
                <TableHead>Handicap</TableHead>
                <TableHead>Indirects</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{monthLabel(r.month, r.year)}</TableCell>
                  <TableCell className="font-mono tabular-nums">{r.women}</TableCell>
                  <TableCell className="font-mono tabular-nums">{r.men}</TableCell>
                  <TableCell className="font-mono tabular-nums">{r.youth}</TableCell>
                  <TableCell className="font-mono tabular-nums">{r.children}</TableCell>
                  <TableCell className="font-mono tabular-nums">{r.disabled}</TableCell>
                  <TableCell className="font-mono tabular-nums">{r.indirect}</TableCell>
                  <TableCell className="text-right"><BeneficiaryEditDialog record={r} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
