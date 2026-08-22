import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/server/api";
import { cn, formatDate } from "@/lib/utils";
import type { NotificationItem } from "@/lib/types";

export const Route = createFileRoute("/_app/notifications")({ component: NotificationsPage });

function NotificationsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<NotificationItem[]>([]);
  function reload() {
    void listNotifications().then(setRows);
  }
  useEffect(() => {
    reload();
  }, []);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Validations, rapports manquants, conventions et messages."
        actions={
          <Button variant="outline" onClick={() => void markAllNotificationsRead().then(reload)}>
            Tout marquer comme lu
          </Button>
        }
      />
      <div className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune notification pour le moment.</p>
        ) : (
          rows.map((n) => (
            <Card
              key={n.id}
              className={cn("p-4", !n.read && "bg-accent/40")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                  {n.href ? (
                    <button
                      type="button"
                      className="mt-1 text-xs font-medium text-primary"
                      onClick={() => {
                        if (!n.read) void markNotificationRead({ data: { id: n.id } });
                        void navigate({ to: n.href as "/" });
                      }}
                    >
                      Ouvrir
                    </button>
                  ) : null}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDate(n.createdAt)}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
