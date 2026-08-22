import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as cn, i as DEMO_ACCOUNTS } from "./utils-BYOSEtN8.mjs";
import { i as useTheme } from "./router-AyguLxs4.mjs";
import { t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
import { t as useActor } from "./use-actor-DJG9MvAJ.mjs";
import { t as PageHeader } from "./page-header-DjF36rJK.mjs";
import { t as Card } from "./card-Dg3Hlph1.mjs";
import { t as Label } from "./label-CFyTbLln.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parametres-DJ5Vd5VP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block h-5 w-5 rounded-full bg-card shadow-card ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" })
}));
Switch.displayName = Switch$1.displayName;
function SettingsPage() {
	const { theme, toggle } = useTheme();
	const { actor } = useActor();
	const user = useCurrentUser();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Paramètres",
		description: "Compte, apparence et informations de la plateforme."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Profil"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Nom · "
						}), actor?.name ?? user?.displayName]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "E-mail · "
						}), actor?.email ?? user?.primaryEmail]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Rôle · "
						}), actor?.role === "admin" ? "Administrateur" : "Représentant de coopérative"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Apparence"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "dark",
							children: "Mode sombre"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							id: "dark",
							checked: theme === "dark",
							onCheckedChange: toggle
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Interface institutionnelle, lisible de jour comme de nuit."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Comptes de démonstration"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: DEMO_ACCOUNTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: a.role
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [
							" — ",
							a.email,
							" / ",
							a.password
						]
					})] }, a.email))
				})]
			})
		]
	})] });
}
//#endregion
export { SettingsPage as component };
