import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { m as formatDate } from "./utils-BYOSEtN8.mjs";
import { l as listActivity } from "./api-DTT0YQAC.mjs";
import { t as useActor } from "./use-actor-DJG9MvAJ.mjs";
import { t as PageHeader } from "./page-header-DjF36rJK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activite-GompY6dE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ActivityPage() {
	const { actor, loading } = useActor();
	const navigate = useNavigate();
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!loading && actor && actor.role !== "admin") {
			navigate({ to: "/tableau" });
			return;
		}
		if (actor?.role === "admin") listActivity().then(setRows);
	}, [
		actor,
		loading,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Journal d'activité",
		description: "Traçabilité des actions (audit log)."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-2xl bg-card shadow-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[720px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-border text-xs uppercase text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
					"Date",
					"Action",
					"Entité",
					"Détail"
				].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-4 py-3 font-medium",
					children: h
				}, h)) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border last:border-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: formatDate(a.createdAt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 capitalize",
						children: a.action
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-4 py-3",
						children: [a.entityType, a.entityId ? ` #${a.entityId}` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: a.details
					})
				]
			}, a.id)) })]
		})
	})] });
}
//#endregion
export { ActivityPage as component };
