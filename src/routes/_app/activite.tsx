import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { listActivity } from "@/lib/server/api";
import { formatDate } from "@/lib/utils";
import { useActor } from "@/hooks/use-actor";
import type { AuditLog } from "@/lib/types";

export const Route = createFileRoute("/_app/activite")({ component: ActivityPage });

function ActivityPage() {
  const { actor, loading } = useActor();
  const navigate = useNavigate();
  const [rows, setRows] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (!loading && actor && actor.role !== "admin") {
      void navigate({ to: "/tableau" });
      return;
    }
    if (actor?.role === "admin") void listActivity().then(setRows);
  }, [actor, loading, navigate]);

  return (
    <div>
      <PageHeader title="Journal d'activité" description="Traçabilité des actions (audit log)." />
      <div className="overflow-x-auto rounded-2xl bg-card shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted-foreground">
            <tr>
              {["Date", "Action", "Entité", "Détail"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{formatDate(a.createdAt)}</td>
                <td className="px-4 py-3 capitalize">{a.action}</td>
                <td className="px-4 py-3">
                  {a.entityType}
                  {a.entityId ? ` #${a.entityId}` : ""}
                </td>
                <td className="px-4 py-3">{a.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
