import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar, NavItem } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { getNotificationsForUser, getPendingReports } from "@/lib/data";
import {
  LayoutDashboard, Building2, Map, FileCheck2, FolderOpen, Upload,
  Search, Bell, BarChart3, Download, Settings, ScrollText,
} from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [notifications, pendingReports] = await Promise.all([
    getNotificationsForUser(session.userId),
    getPendingReports(),
  ]);

  const items: NavItem[] = [
    { href: "/admin", label: "Tableau de bord", icon: <LayoutDashboard /> },
    { href: "/admin/cooperatives", label: "Coopératives", icon: <Building2 /> },
    { href: "/admin/map", label: "Carte interactive", icon: <Map /> },
    { href: "/admin/reports", label: "Rapports mensuels", icon: <FileCheck2 />, badge: pendingReports.length },
    { href: "/admin/conventions", label: "Conventions", icon: <ScrollText /> },
    { href: "/admin/documents", label: "Documents", icon: <FolderOpen /> },
    { href: "/admin/import", label: "Import CSV", icon: <Upload /> },
    { href: "/admin/search", label: "Recherche avancée", icon: <Search /> },
    { href: "/admin/analytics", label: "Analytique", icon: <BarChart3 /> },
    { href: "/admin/exports", label: "Exports", icon: <Download /> },
    { href: "/admin/notifications", label: "Notifications", icon: <Bell /> },
    { href: "/admin/settings", label: "Paramètres", icon: <Settings /> },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={items}
        roleLabel="Espace Administrateur"
        footerLabel="Direction de la Transformation Digitale — Fondation OCP"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          name={session.name}
          role="Administrateur"
          notifications={notifications as any}
          searchAction="/admin/search"
        />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">{children}</main>
      </div>
    </div>
  );
}
