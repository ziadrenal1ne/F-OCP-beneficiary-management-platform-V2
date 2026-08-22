import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { g as formatNumber } from "./utils-BYOSEtN8.mjs";
import { d as listCooperatives, h as listOdds } from "./api-DTT0YQAC.mjs";
import { t as PageHeader } from "./page-header-DjF36rJK.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Dg3Hlph1.mjs";
import { n as tooltipStyle } from "./chart-theme-BWKCHhfh.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, r as BarChart, s as CartesianGrid } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/odds-BuTfLC-V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OddsPage() {
	const [odds, setOdds] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [names, setNames] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listOdds().then(setOdds);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!selected) {
			setNames([]);
			return;
		}
		listCooperatives({ data: { odd: selected } }).then((rows) => setNames(rows.map((c) => ({
			id: c.id,
			name: c.name
		}))));
	}, [selected]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Objectifs de développement durable",
			description: "Chaque coopérative est liée à un ou plusieurs ODD. Cliquez une barre pour filtrer."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Distribution" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "h-80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: odds.map((o) => ({
							name: `${o.code}`,
							count: o.count,
							full: o.nameFr
						})),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--border)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								tick: {
									fontSize: 11,
									fill: "var(--muted-foreground)"
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fontSize: 11,
									fill: "var(--muted-foreground)"
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "count",
								fill: "var(--chart-1)",
								radius: [
									6,
									6,
									0,
									0
								],
								onClick: (d) => setSelected(Number(d.name))
							})
						]
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
			children: odds.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setSelected(o.code),
				className: "rounded-2xl bg-card p-4 text-left shadow-card hover:shadow-card-hover",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium text-muted-foreground",
						children: ["ODD ", o.code]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-medium",
						children: o.nameFr
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm tabular-nums text-muted-foreground",
						children: [formatNumber(o.count), " coopératives"]
					})
				]
			}, o.code))
		}),
		selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-display text-lg",
				children: ["Coopératives — ODD ", selected]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1",
				children: names.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cooperatives/$id",
					params: { id: String(n.id) },
					className: "text-sm hover:underline",
					children: n.name
				}) }, n.id))
			})]
		}) : null
	] });
}
//#endregion
export { OddsPage as component };
