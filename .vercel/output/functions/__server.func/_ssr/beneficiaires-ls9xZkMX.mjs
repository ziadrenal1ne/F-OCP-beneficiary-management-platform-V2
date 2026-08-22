import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { g as formatNumber, x as monthLabel } from "./utils-BYOSEtN8.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DH4wG0kz.mjs";
import { E as upsertBeneficiaryStats, d as listCooperatives, r as getCooperative } from "./api-DTT0YQAC.mjs";
import { t as useActor } from "./use-actor-DJG9MvAJ.mjs";
import { t as PageHeader } from "./page-header-DjF36rJK.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Dg3Hlph1.mjs";
import { t as Label } from "./label-CFyTbLln.mjs";
import { n as tooltipStyle } from "./chart-theme-BWKCHhfh.mjs";
import { t as Input } from "./input-Cj9iy2dH.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BXYo9c-Y.mjs";
import { a as XAxis, d as ResponsiveContainer, f as Tooltip, i as YAxis, o as Area, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/beneficiaires-ls9xZkMX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BeneficiariesPage() {
	const { actor } = useActor();
	const [coops, setCoops] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [months, setMonths] = (0, import_react.useState)([]);
	const now = /* @__PURE__ */ new Date();
	const [year, setYear] = (0, import_react.useState)(now.getFullYear());
	const [month, setMonth] = (0, import_react.useState)(now.getMonth() + 1);
	const [form, setForm] = (0, import_react.useState)({
		women: 0,
		men: 0,
		youth: 0,
		adults: 0,
		children: 0,
		disabled: 0,
		indirect: 0
	});
	(0, import_react.useEffect)(() => {
		listCooperatives({ data: {} }).then((rows) => {
			setCoops(rows);
			const id = actor?.cooperativeId ?? rows[0]?.id ?? null;
			setSelected(id);
		});
	}, [actor?.cooperativeId]);
	(0, import_react.useEffect)(() => {
		if (!selected) return;
		getCooperative({ data: { id: selected } }).then((p) => {
			setMonths(p.months);
			const last = p.months[p.months.length - 1];
			if (last) setForm({
				women: last.women,
				men: last.men,
				youth: last.youth,
				adults: last.adults,
				children: last.children,
				disabled: last.disabled,
				indirect: last.indirect
			});
		});
	}, [selected]);
	const chart = months.map((m) => ({
		label: `${monthLabel(m.month)} ${String(m.year).slice(2)}`,
		femmes: m.women,
		hommes: m.men,
		jeunes: m.youth
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Bénéficiaires",
			description: "Statistiques mensuelles : femmes, hommes, jeunes, adultes, enfants, handicap et indirects."
		}),
		actor?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: selected ? String(selected) : "",
				onValueChange: (v) => setSelected(Number(v)),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Coopérative" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: coops.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: String(c.id),
					children: c.name
				}, c.id)) })]
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Évolution" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: chart,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--border)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "femmes",
								stroke: "var(--chart-1)",
								fill: "var(--chart-1)",
								fillOpacity: .3
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "hommes",
								stroke: "var(--chart-2)",
								fill: "var(--chart-2)",
								fillOpacity: .25
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "jeunes",
								stroke: "var(--chart-3)",
								fill: "var(--chart-3)",
								fillOpacity: .2
							})
						]
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3 rounded-2xl bg-card p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4",
			onSubmit: (e) => {
				e.preventDefault();
				if (!selected) return;
				upsertBeneficiaryStats({ data: {
					cooperativeId: selected,
					year,
					month,
					...form
				} }).then(() => {
					toast.success("Statistiques enregistrées");
					return getCooperative({ data: { id: selected } });
				}).then((p) => {
					if (p) setMonths(p.months);
				}).catch((err) => toast.error(err instanceof Error ? err.message : "Erreur"));
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Année",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: year,
						onChange: (e) => setYear(Number(e.target.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Mois",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						max: 12,
						value: month,
						onChange: (e) => setMonth(Number(e.target.value))
					})
				}),
				[
					"women",
					"men",
					"youth",
					"adults",
					"children",
					"disabled",
					"indirect"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: labelOf(k),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 0,
						value: form[k],
						onChange: (e) => setForm((f) => ({
							...f,
							[k]: Number(e.target.value)
						}))
					})
				}, k)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2 lg:col-span-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Mettre à jour le mois"
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-x-auto rounded-2xl bg-card shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[800px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-border text-xs uppercase text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Période",
						"Femmes",
						"Hommes",
						"Jeunes",
						"Adultes",
						"Enfants",
						"Handicap",
						"Indirects"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: h
					}, h)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [...months].reverse().map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-2",
							children: [
								monthLabel(m.month),
								" ",
								m.year
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 tabular-nums",
							children: formatNumber(m.women)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 tabular-nums",
							children: formatNumber(m.men)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 tabular-nums",
							children: formatNumber(m.youth)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 tabular-nums",
							children: formatNumber(m.adults)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 tabular-nums",
							children: formatNumber(m.children)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 tabular-nums",
							children: formatNumber(m.disabled)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 tabular-nums",
							children: formatNumber(m.indirect)
						})
					]
				}, `${m.year}-${m.month}`)) })]
			})
		})
	] });
}
function labelOf(k) {
	return {
		women: "Femmes",
		men: "Hommes",
		youth: "Jeunes",
		adults: "Adultes",
		children: "Enfants",
		disabled: "Handicap",
		indirect: "Indirects"
	}[k] ?? k;
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { BeneficiariesPage as component };
