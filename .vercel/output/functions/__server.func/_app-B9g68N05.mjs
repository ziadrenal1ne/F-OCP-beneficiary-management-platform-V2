import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link, y as Navigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "./_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as signOut } from "./_ssr/client-B40BzJxt.mjs";
import { d as cn, n as APP_NAME, s as ORG_NAME } from "./_ssr/utils-BYOSEtN8.mjs";
import { D as Activity, E as Bell, _ as FolderOpen, c as Search, d as Menu, f as MapPinned, g as Handshake, i as Upload, l as ScrollText, m as LayoutDashboard, n as Users, o as Sun, p as LogOut, s as Settings, t as X, u as Moon, v as FileText, w as ChartColumn, y as Earth } from "./_libs/lucide-react.mjs";
import { a as DialogOverlay, n as DialogClose, o as DialogPortal, r as DialogContent, t as Dialog } from "./_libs/@radix-ui/react-dialog+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { i as useTheme } from "./_ssr/router-AyguLxs4.mjs";
import { n as useCurrentUserState, t as useCurrentUser } from "./_ssr/use-current-user-DG6UNzh9.mjs";
import { t as Button } from "./_ssr/button-DH4wG0kz.mjs";
import { _ as markAllNotificationsRead, m as listNotifications } from "./_ssr/api-DTT0YQAC.mjs";
import { t as useActor } from "./_ssr/use-actor-DJG9MvAJ.mjs";
import { t as Skeleton } from "./_ssr/skeleton-eNM5uZbJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-B9g68N05.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-foreground/20", className),
	...props
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var SheetContent = import_react.forwardRef(({ side = "left", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn("fixed z-50 flex h-full w-72 flex-col bg-sidebar text-sidebar-foreground shadow-card", side === "left" ? "inset-y-0 left-0" : "inset-y-0 right-0", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Fermer"
		})]
	})]
})] }));
SheetContent.displayName = DialogContent.displayName;
var NAV = [
	{
		to: "/tableau",
		label: "Tableau de bord",
		icon: LayoutDashboard
	},
	{
		to: "/cooperatives",
		label: "Coopératives",
		icon: Earth
	},
	{
		to: "/carte",
		label: "Carte",
		icon: MapPinned
	},
	{
		to: "/beneficiaires",
		label: "Bénéficiaires",
		icon: Users
	},
	{
		to: "/rapports",
		label: "Rapports",
		icon: FileText
	},
	{
		to: "/conventions",
		label: "Conventions",
		icon: Handshake
	},
	{
		to: "/documents",
		label: "Documents",
		icon: FolderOpen
	},
	{
		to: "/odds",
		label: "ODD",
		icon: Activity
	},
	{
		to: "/analytique",
		label: "Analytique",
		icon: ChartColumn
	},
	{
		to: "/recherche",
		label: "Recherche",
		icon: Search
	},
	{
		to: "/import",
		label: "Import CSV",
		icon: Upload,
		adminOnly: true
	},
	{
		to: "/notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		to: "/activite",
		label: "Journal",
		icon: ScrollText,
		adminOnly: true
	},
	{
		to: "/parametres",
		label: "Paramètres",
		icon: Settings
	}
];
function NavLinks({ actor, onNavigate, unread }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-0.5 px-3",
		children: NAV.filter((item) => !item.adminOnly || actor?.role === "admin").map((item) => {
			const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors", active ? "bg-sidebar-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 truncate",
						children: item.label
					}),
					item.to === "/notifications" && unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground tabular-nums",
						children: unread > 9 ? "9+" : unread
					}) : null
				]
			}, item.to);
		})
	});
}
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/tableau",
		className: "flex items-center gap-3 px-5 py-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 24 24",
				className: "h-5 w-5",
				fill: "none",
				"aria-hidden": true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 3 4.5 7.5v9L12 21l7.5-4.5v-9L12 3Z",
					stroke: "currentColor",
					strokeWidth: "1.6"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 8.2v7.6M8.4 10.3 12 12.2l3.6-1.9",
					stroke: "currentColor",
					strokeWidth: "1.6",
					strokeLinecap: "round"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-display text-sm font-medium leading-tight",
				children: ORG_NAME
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[11px] text-muted-foreground",
				children: APP_NAME
			})]
		})]
	});
}
function SidebarBody({ actor, onNavigate, unread }) {
	const user = useCurrentUser();
	const { theme, toggle } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto pb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {
					actor,
					onNavigate,
					unread
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-sidebar-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary",
						children: (actor?.name ?? user?.displayName ?? "U").charAt(0).toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: actor?.name ?? user?.displayName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[11px] text-muted-foreground",
							children: actor?.role === "admin" ? "Administrateur" : "Coopérative"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: toggle,
						"aria-label": "Thème",
						children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "flex-1 justify-start",
						onClick: () => void signOut("/login").catch(() => toast.error("Déconnexion impossible")),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), "Déconnexion"]
					})]
				})]
			})
		]
	});
}
function crumb(pathname) {
	const labels = {
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
		parametres: "Paramètres"
	};
	const parts = pathname.split("/").filter(Boolean);
	if (parts.length === 0) return "Accueil";
	return parts.map((p) => labels[p] ?? (p.match(/^\d+$/) ? `n° ${p}` : p)).join(" · ");
}
function AppShell({ children }) {
	const { actor } = useActor();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [unread, setUnread] = (0, import_react.useState)(0);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		listNotifications().then((items) => setUnread(items.filter((n) => !n.read).length)).catch(() => setUnread(0));
	}, [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, {
					actor,
					unread
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					side: "left",
					className: "w-72 p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, {
						actor,
						unread,
						onNavigate: () => setOpen(false)
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-64",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "lg:hidden",
							onClick: () => setOpen(true),
							"aria-label": "Menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm text-muted-foreground",
								children: crumb(pathname)
							})
						}),
						unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => {
								markAllNotificationsRead().then(() => setUnread(0));
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unread]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/notifications",
							className: "text-muted-foreground hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "px-4 py-6 sm:px-6 lg:px-8",
					children
				})]
			})
		]
	});
}
function AppLayout() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden w-64 border-r border-border p-4 lg:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-2",
				children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }, i))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" })
				]
			})]
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { AppLayout as component };
