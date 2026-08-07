"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { cloneElement, isValidElement } from "react";

export type NavItem = { href: string; label: string; icon: React.ReactElement; badge?: number };

export function Sidebar({
  items, footerLabel, roleLabel,
}: {
  items: NavItem[];
  footerLabel: string;
  roleLabel: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-semibold text-sm">
          F
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight tracking-tight">Fondation OCP</p>
          <p className="text-[11px] text-sidebar-foreground/50">{roleLabel}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && item.href !== "/cooperative" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <span className="flex items-center gap-2.5">
                {isValidElement(item.icon)
                  ? cloneElement(item.icon as React.ReactElement<any>, {
                      className: cn("h-4 w-4", active ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-primary"),
                    })
                  : item.icon}
                {item.label}
              </span>
              {!!item.badge && (
                <span className="rounded-full bg-sidebar-primary px-1.5 py-0.5 text-[10px] font-semibold text-sidebar-primary-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-5 rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3">
        <p className="text-[11px] leading-relaxed text-sidebar-foreground/55">{footerLabel}</p>
      </div>
    </aside>
  );
}
