import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listReports } from "@/lib/server/api";
import { REPORT_STATUSES } from "@/lib/constants";
import { formatMonth, formatNumber } from "@/lib/utils";
import type { Report } from "@/lib/types";

export const Route = createFileRoute("/_app/rapports/")({ component: ReportsPage });

function ReportsPage() {
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState<Report[]>([]);

  useEffect(() => {
    void listReports({ data: { status: status === "all" ? undefined : status } }).then(setRows);
  }, [status]);

  return (
    <div>
      <PageHeader
        title="Rapports mensuels"
        description="Cycle de saisie, soumission et validation administrative."
        actions={
          <Button asChild>
            <Link to="/rapports/nouveau">Nouveau rapport</Link>
          </Button>
        }
      />
      <div className="mb-4 max-w-xs">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {REPORT_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-card shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Période</th>
              <th className="px-4 py-3 font-medium">Coopérative</th>
              <th className="px-4 py-3 font-medium">Bénéficiaires</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link to="/rapports/$id" params={{ id: String(r.id) }} className="font-medium hover:underline">
                    {formatMonth(r.year, r.month)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.cooperativeName}</td>
                <td className="px-4 py-3 tabular-nums">{formatNumber(r.women + r.men)}</td>
                <td className="px-4 py-3"><StatusBadge value={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
