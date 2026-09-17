import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bell,
  FileText,
  FolderOpen,
  Globe2,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  Moon,
  ScrollText,
  Search,
  Settings,
  Sun,
  Upload,
  Users,
  Handshake,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { useActor } from "@/hooks/use-actor";
import { listNotifications, markAllNotificationsRead } from "@/lib/server/api";
import { APP_NAME, ORG_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import type { Actor, NotificationItem } from "@/lib/types";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
};

const NAV: NavItem[] = [
  { to: "/tableau", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/cooperatives", label: "Coopératives", icon: Globe2 },
  { to: "/carte", label: "Carte", icon: MapPinned },
  { to: "/beneficiaires", label: "Bénéficiaires", icon: Users },
  { to: "/rapports", label: "Rapports", icon: FileText },
  { to: "/conventions", label: "Conventions", icon: Handshake },
  { to: "/documents", label: "Documents", icon: FolderOpen },
  { to: "/odds", label: "ODD", icon: Activity },
  { to: "/analytique", label: "Analytique", icon: BarChart3 },
  { to: "/recherche", label: "Recherche", icon: Search },
  { to: "/import", label: "Import CSV", icon: Upload, adminOnly: true },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/activite", label: "Journal", icon: ScrollText, adminOnly: true },
  { to: "/parametres", label: "Paramètres", icon: Settings },
];

function NavLinks({
  actor,
  onNavigate,
  unread,
}: {
  actor: Actor | null;
  onNavigate?: () => void;
  unread: number;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {NAV.filter((item) => !item.adminOnly || actor?.role === "admin").map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
            {item.to === "/notifications" && unread > 0 ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground tabular-nums">
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/tableau" className="flex items-center gap-3 px-5 py-5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path d="M12 3 4.5 7.5v9L12 21l7.5-4.5v-9L12 3Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8.2v7.6M8.4 10.3 12 12.2l3.6-1.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-medium leading-tight">{ORG_NAME}</span>
        <span className="block text-[11px] text-muted-foreground">{APP_NAME}</span>
      </span>
    </Link>
  );
}

function SidebarBody({
  actor,
  onNavigate,
  unread,
}: {
  actor: Actor | null;
  onNavigate?: () => void;
  unread: number;
}) {
  const user = useCurrentUser();
  const { theme, toggle } = useTheme();
  return (
    <div className="flex h-full flex-col">
      <Brand />
      <div className="flex-1 overflow-y-auto pb-4">
        <NavLinks actor={actor} onNavigate={onNavigate} unread={unread} />
      </div>
      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
            {(actor?.name ?? user?.displayName ?? "U").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{actor?.name ?? user?.displayName}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {actor?.role === "admin" ? "Administrateur" : "Coopérative"}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Thème">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            className="flex-1 justify-start"
            onClick={() => void signOut("/login").catch(() => toast.error("Déconnexion impossible"))}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
}

function crumb(pathname: string) {
  const labels: Record<string, string> = {
    tableau: "Tableau de bord",
    cooperatives: "Coopératives",
    carte: "Carte",
    beneficiaires: "Bénéficiaires",
    rapports: "Rapports",
    nouveau: "Nouveau",
    conventions: "Conventions",
    documents: "Documents",
    odds: "ODD",
    analytique: "Analytique",
    recherche: "Recherche",
    import: "Import CSV",
    notifications: "Notifications",
    activite: "Journal",
    parametres: "Paramètres",
  };
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "Accueil";
  return parts.map((p) => labels[p] ?? (p.match(/^\d+$/) ? `n° ${p}` : p)).join(" · ");
}

export function AppShell({ children }: { children: ReactNode }) {
  const { actor } = useActor();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    listNotifications()
      .then((items: NotificationItem[]) => setUnread(items.filter((n) => !n.read).length))
      .catch(() => setUnread(0));
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarBody actor={actor} unread={unread} />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarBody actor={actor} unread={unread} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-muted-foreground">
              {crumb(pathname)}
            </p>
          </div>
          {unread > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                void markAllNotificationsRead().then(() => setUnread(0));
              }}
            >
              <Bell className="h-4 w-4" />
              {unread}
            </Button>
          ) : (
            <Link to="/notifications" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </Link>
          )}
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
