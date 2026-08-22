import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { f as downloadBlob, g as formatNumber, r as COOP_STATUSES } from "./utils-BYOSEtN8.mjs";
import { b as Download, c as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DH4wG0kz.mjs";
import { d as listCooperatives, h as listOdds, p as listFilterOptions, t as exportCooperatives } from "./api-DTT0YQAC.mjs";
import { t as useActor } from "./use-actor-DJG9MvAJ.mjs";
import { t as Skeleton } from "./skeleton-eNM5uZbJ.mjs";
import { t as PageHeader } from "./page-header-DjF36rJK.mjs";
import { t as Card } from "./card-Dg3Hlph1.mjs";
import { t as StatusBadge } from "./status-badge-Cxa23Bc6.mjs";
import { t as Input } from "./input-Cj9iy2dH.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BXYo9c-Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cooperatives-DXHuNvLC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CooperativesPage() {
	const { actor } = useActor();
	const [q, setQ] = (0, import_react.useState)("");
	const [region, setRegion] = (0, import_react.useState)("all");
	const [sector, setSector] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [odd, setOdd] = (0, import_react.useState)("all");
	const [rows, setRows] = (0, import_react.useState)(null);
	const [options, setOptions] = (0, import_react.useState)({
		regions: [],
		sectors: []
	});
	const [odds, setOdds] = (0, import_react.useState)([]);
	function load() {
		listCooperatives({ data: {
			q: q || void 0,
			region: region === "all" ? void 0 : region,
			sector: sector === "all" ? void 0 : sector,
			status: status === "all" ? void 0 : status,
			odd: odd === "all" ? void 0 : Number(odd)
		} }).then(setRows);
	}
	(0, import_react.useEffect)(() => {
		load();
		listFilterOptions().then((o) => setOptions({
			regions: o.regions,
			sectors: o.sectors
		}));
		listOdds().then((o) => setOdds(o));
	}, []);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(load, 200);
		return () => clearTimeout(t);
	}, [
		q,
		region,
		sector,
		status,
		odd
	]);
	const total = (0, import_react.useMemo)(() => rows?.reduce((s, c) => s + c.totalDirect, 0) ?? 0, [rows]);
	async function onExportCsv() {
		try {
			const data = await exportCooperatives();
			const header = "id,name,city,province,region,sector,status,women,men,youth,disabled,indirect";
			const body = data.map((c) => [
				c.id,
				csv(c.name),
				csv(c.city),
				csv(c.province),
				csv(c.region),
				csv(c.sector),
				c.status,
				c.women,
				c.men,
				c.youth,
				c.disabled,
				c.indirect
			].join(",")).join("\n");
			downloadBlob("cooperatives-focp.csv", new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" }));
			toast.success("Export CSV téléchargé");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Export impossible");
		}
	}
	async function onExportXlsx() {
		try {
			const data = await exportCooperatives();
			const xlsx = await import("../_libs/xlsx.mjs").then((n) => n.t);
			const ws = xlsx.utils.json_to_sheet(data.map((c) => ({
				Nom: c.name,
				Ville: c.city,
				Province: c.province,
				Région: c.region,
				Secteur: c.sector,
				Statut: c.status,
				Femmes: c.women,
				Hommes: c.men,
				Jeunes: c.youth,
				Handicap: c.disabled,
				Indirects: c.indirect
			})));
			const wb = xlsx.utils.book_new();
			xlsx.utils.book_append_sheet(wb, ws, "Coopératives");
			xlsx.writeFile(wb, "cooperatives-focp.xlsx");
			toast.success("Export Excel téléchargé");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Export impossible");
		}
	}
	async function onExportPdf() {
		try {
			const data = await exportCooperatives();
			const { jsPDF } = await import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			const autoTable = (await import("../_libs/jspdf-autotable.mjs").then((n) => n.t)).default;
			const doc = new jsPDF({ orientation: "landscape" });
			doc.setFontSize(14);
			doc.text("Fondation OCP — Coopératives Axe Éco-Social", 14, 16);
			autoTable(doc, {
				startY: 22,
				head: [[
					"Nom",
					"Ville",
					"Région",
					"Secteur",
					"Bénéf."
				]],
				body: data.slice(0, 80).map((c) => [
					c.name,
					c.city,
					c.region,
					c.sector,
					String(c.totalDirect)
				]),
				styles: { fontSize: 8 }
			});
			doc.save("cooperatives-focp.pdf");
			toast.success("Export PDF téléchargé");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Export impossible");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Coopératives",
			description: `${rows ? formatNumber(rows.length) : "…"} structures · ${formatNumber(total)} bénéficiaires directs`,
			actions: actor?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => void onExportCsv(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " CSV"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => void onExportXlsx(),
					children: "Excel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => void onExportPdf(),
					children: "PDF"
				})
			] }) : null
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						placeholder: "Rechercher un nom, une ville…",
						value: q,
						onChange: (e) => setQ(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: region,
					onValueChange: setRegion,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Région" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "Toutes les régions"
					}), options.regions.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: r,
						children: r
					}, r))] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: sector,
					onValueChange: setSector,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Secteur" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "Tous les secteurs"
					}), options.sectors.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: r,
						children: r
					}, r))] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: status,
					onValueChange: setStatus,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Statut" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "Tous les statuts"
					}), COOP_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: s.value,
						children: s.label
					}, s.value))] })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 max-w-xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: odd,
				onValueChange: setOdd,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "ODD" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "all",
					children: "Tous les ODD"
				}), odds.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
					value: String(o.code),
					children: [
						"ODD ",
						o.code,
						" — ",
						o.shortName
					]
				}, o.code))] })]
			})
		}),
		!rows ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
			children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40" }, i))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
			children: rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/cooperatives/$id",
				params: { id: String(c.id) },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "h-full p-5 transition-shadow hover:shadow-card-hover",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-11 w-11 place-items-center rounded-xl bg-accent text-xs font-semibold text-accent-foreground",
								children: c.logoInitials
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: c.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 font-medium leading-snug",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								c.city,
								" · ",
								c.region
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: c.sector
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm tabular-nums",
							children: [
								formatNumber(c.totalDirect),
								" bénéficiaires",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										" · ",
										formatNumber(c.women),
										" femmes"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1",
							children: c.odds.slice(0, 4).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium",
								children: ["ODD ", o.code]
							}, o.id))
						})
					]
				})
			}, c.id))
		})
	] });
}
function csv(v) {
	if (v.includes(",") || v.includes("\"")) return `"${v.replaceAll("\"", "\"\"")}"`;
	return v;
}
//#endregion
export { CooperativesPage as component };
