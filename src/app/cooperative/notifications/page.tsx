import { getSession } from "@/lib/auth";
import { getNotificationsForUser } from "@/lib/data";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell, CheckCircle2, XCircle, ScrollText, MessageSquare, FileWarning } from "lucide-react";

const TYPE_META: Record<string, { icon: any; color: string }> = {
  REPORT_APPROVED: { icon: CheckCircle2, color: "text-success" },
  REPORT_REJECTED: { icon: XCircle, color: "text-destructive" },
  REPORT_MISSING: { icon: FileWarning, color: "text-warning-foreground" },
  CONVENTION_EXPIRING: { icon: ScrollText, color: "text-warning-foreground" },
  DOCUMENT_REJECTED: { icon: XCircle, color: "text-destructive" },
  ADMIN_MESSAGE: { icon: MessageSquare, color: "text-primary" },
  NEW_SUBMISSION: { icon: Bell, color: "text-primary" },
};

export default async function CooperativeNotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const notifications = await getNotificationsForUser(session.userId, 50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{notifications.filter((n) => !n.read).length} non lue(s)</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 && <p className="p-6 text-sm text-muted-foreground">Aucune notification.</p>}
          {notifications.map((n) => {
            const meta = TYPE_META[n.type] ?? TYPE_META.ADMIN_MESSAGE;
            const Icon = meta.icon;
            return (
              <div key={n.id} className={`flex items-start gap-3 border-b p-4 last:border-0 ${!n.read ? "bg-secondary/40" : ""}`}>
                <Icon className={`h-4.5 w-4.5 mt-0.5 shrink-0 ${meta.color}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {!n.read && <Badge variant="secondary" className="shrink-0">Nouveau</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: fr })}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
