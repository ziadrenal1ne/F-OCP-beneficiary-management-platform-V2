import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as cn, m as formatDate } from "./utils-BYOSEtN8.mjs";
import { t as Button } from "./button-DH4wG0kz.mjs";
import { _ as markAllNotificationsRead, m as listNotifications, v as markNotificationRead } from "./api-DTT0YQAC.mjs";
import { t as PageHeader } from "./page-header-DjF36rJK.mjs";
import { t as Card } from "./card-Dg3Hlph1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-CVxg96sU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const navigate = useNavigate();
	const [rows, setRows] = (0, import_react.useState)([]);
	function reload() {
		listNotifications().then(setRows);
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Notifications",
		description: "Validations, rapports manquants, conventions et messages.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => void markAllNotificationsRead().then(reload),
			children: "Tout marquer comme lu"
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Aucune notification pour le moment."
		}) : rows.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: cn("p-4", !n.read && "bg-accent/40"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: n.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: n.body
					}),
					n.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-1 text-xs font-medium text-primary",
						onClick: () => {
							if (!n.read) markNotificationRead({ data: { id: n.id } });
							navigate({ to: n.href });
						},
						children: "Ouvrir"
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 text-xs text-muted-foreground",
					children: formatDate(n.createdAt)
				})]
			})
		}, n.id))
	})] });
}
//#endregion
export { NotificationsPage as component };
