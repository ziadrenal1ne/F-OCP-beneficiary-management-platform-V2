import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar, NavItem } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { getNotificationsForUser } from "@/lib/data";
import {
  LayoutDashboard, Building2, Users, FileCheck2, FolderOpen, Bell, Settings,
} from "lucide-react";

export default async function CooperativeLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "COOPERATIVE") redirect("/login");

  const notifications = await getNotificationsForUser(session.userId);

  const items: NavItem[] = [
    { href: "/cooperative", label: "Tableau de bord", icon: <LayoutDashboard /> },
    { href: "/cooperative/profile", label: "Profil coopérative", icon: <Building2 /> },
    { href: "/cooperative/beneficiaries", label: "Bénéficiaires", icon: <Users /> },
    { href: "/cooperative/reports", label: "Rapports mensuels", icon: <FileCheck2 /> },
    { href: "/cooperative/documents", label: "Documents", icon: <FolderOpen /> },
    { href: "/cooperative/notifications", label: "Notifications", icon: <Bell /> },
    { href: "/cooperative/settings", label: "Paramètres", icon: <Settings /> },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} roleLabel="Espace Coopérative" footerLabel="Axe Éco-Social — Fondation OCP" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar name={session.name} role="Coopérative" notifications={notifications as any} />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">{children}</main>
      </div>
    </div>
  );
}
