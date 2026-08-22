import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { g as formatNumber, r as COOP_STATUSES } from "./utils-BYOSEtN8.mjs";
import { t as Button } from "./button-DH4wG0kz.mjs";
import { d as listCooperatives, h as listOdds, p as listFilterOptions } from "./api-DTT0YQAC.mjs";
import { t as PageHeader } from "./page-header-DjF36rJK.mjs";
import { t as Card } from "./card-Dg3Hlph1.mjs";
import { t as Label } from "./label-CFyTbLln.mjs";
import { t as StatusBadge } from "./status-badge-Cxa23Bc6.mjs";
import { t as Input } from "./input-Cj9iy2dH.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BXYo9c-Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recherche-CauCTPJv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [region, setRegion] = (0, import_react.useState)("all");
	const [province, setProvince] = (0, import_react.useState)("all");
	const [city, setCity] = (0, import_react.useState)("all");
	const [country, setCountry] = (0, import_react.useState)("Maroc");
	const [sector, setSector] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [odd, setOdd] = (0, import_react.useState)("all");
	const [minBeneficiaries, setMinBeneficiaries] = (0, import_react.useState)(0);
	const [options, setOptions] = (0, import_react.useState)({
		regions: [],
		cities: [],
		provinces: [],
		sectors: []
	});
	const [odds, setOdds] = (0, import_react.useState)([]);
	const [rows, setRows] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		listFilterOptions().then(setOptions);
		listOdds().then(setOdds);
	}, []);
	function search() {
		listCooperatives({ data: {
			q: q || void 0,
			region: region === "all" ? void 0 : region,
			province: province === "all" ? void 0 : province,
			city: city === "all" ? void 0 : city,
			country: country || void 0,
			sector: sector === "all" ? void 0 : sector,
			status: status === "all" ? void 0 : status,
			odd: odd === "all" ? void 0 : Number(odd),
			minBeneficiaries: minBeneficiaries || void 0
		} }).then(setRows);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Recherche avancée",
			description: "Nom, territoire, secteur, ODD et volume de bénéficiaires."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mb-6 grid gap-3 rounded-2xl bg-card p-5 shadow-card sm:grid-cols-2 lg:grid-cols-3",
			onSubmit: (e) => {
				e.preventDefault();
				search();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Nom",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Al Amal, argan…"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Pays",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: country,
						onChange: (e) => setCountry(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Région",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: region,
						onValueChange: setRegion,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Toutes"
						}), options.regions.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r,
							children: r
						}, r))] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Province",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: province,
						onValueChange: setProvince,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Toutes"
						}), options.provinces.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r,
							children: r
						}, r))] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Ville",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: city,
						onValueChange: setCity,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Toutes"
						}), options.cities.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r,
							children: r
						}, r))] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Secteur",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: sector,
						onValueChange: setSector,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Tous"
						}), options.sectors.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r,
							children: r
						}, r))] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Statut",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: setStatus,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Tous"
						}), COOP_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.value,
							children: s.label
						}, s.value))] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ODD",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: odd,
						onValueChange: setOdd,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Tous"
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Bénéficiaires min.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 0,
						value: minBeneficiaries,
						onChange: (e) => setMinBeneficiaries(Number(e.target.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Rechercher"
					})
				})
			]
		}),
		rows ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-sm text-muted-foreground",
			children: [formatNumber(rows.length), " résultat(s)"]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: rows?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/cooperatives/$id",
				params: { id: String(c.id) },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center justify-between p-4 hover:shadow-card-hover",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							c.city,
							" · ",
							c.province,
							" · ",
							c.region,
							" · ",
							c.sector
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm tabular-nums",
							children: formatNumber(c.totalDirect)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: c.status })]
					})]
				})
			}, c.id))
		})
	] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { SearchPage as component };
