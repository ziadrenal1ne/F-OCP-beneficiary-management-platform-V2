import { getSession } from "@/lib/auth";
import { getNotificationsForUser } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { markNotificationRead } from "@/app/actions/coop";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Bell, FileCheck2, FileX2, ScrollText, MessageSquare, PlusCircle,
} from "lucide-react";

const TYPE_ICON: Record<string, any> = {
  REPORT_APPROVED: FileCheck2, REPORT_REJECTED: FileX2, REPORT_MISSING: Bell,
  CONVENTION_EXPIRING: ScrollText, DOCUMENT_REJECTED: FileX2, ADMIN_MESSAGE: MessageSquare, NEW_SUBMISSION: PlusCircle,
};

export default async function AdminNotificationsPage() {
  const session = await getSession();
  const notifications = await getNotificationsForUser(session!.userId, 100);
  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{unread.length} non lue(s) sur {notifications.length}</p>
        </div>
      </div>

      <div className="space-y-2">
        {notifications.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">Aucune notification.</Card>
        )}
        {notifications.map((n) => {
          const Icon = TYPE_ICON[n.type] ?? Bell;
          return (
            <Card key={n.id} className={`flex items-start gap-3 p-4 ${!n.read ? "border-primary/30 bg-primary/5" : ""}`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted"><Icon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  {!n.read && <Badge variant="secondary" className="shrink-0">Nouveau</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: fr })}</p>
              </div>
              {!n.read && (
                <form action={markNotificationRead}>
                  <input type="hidden" name="notificationId" value={n.id} />
                  <Button type="submit" size="sm" variant="ghost">Marquer comme lu</Button>
                </form>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
