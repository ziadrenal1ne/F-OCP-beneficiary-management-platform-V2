import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DH4wG0kz.mjs";
import { S as saveReport, d as listCooperatives } from "./api-DTT0YQAC.mjs";
import { t as useActor } from "./use-actor-DJG9MvAJ.mjs";
import { t as PageHeader } from "./page-header-DjF36rJK.mjs";
import { t as Label } from "./label-CFyTbLln.mjs";
import { t as Textarea } from "./textarea-BNhrVoXh.mjs";
import { t as Input } from "./input-Cj9iy2dH.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BXYo9c-Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nouveau-CNnCbxHp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewReportPage() {
	const { actor } = useActor();
	const navigate = useNavigate();
	const now = /* @__PURE__ */ new Date();
	const [cooperativeId, setCooperativeId] = (0, import_react.useState)(null);
	const [coops, setCoops] = (0, import_react.useState)([]);
	const [year, setYear] = (0, import_react.useState)(now.getFullYear());
	const [month, setMonth] = (0, import_react.useState)(now.getMonth() + 1);
	const [title, setTitle] = (0, import_react.useState)(`Rapport ${now.toLocaleDateString("fr-FR", {
		month: "long",
		year: "numeric"
	})}`);
	const [activitySummary, setActivitySummary] = (0, import_react.useState)("");
	const [achievements, setAchievements] = (0, import_react.useState)("");
	const [challenges, setChallenges] = (0, import_react.useState)("");
	const [futureActions, setFutureActions] = (0, import_react.useState)("");
	const [women, setWomen] = (0, import_react.useState)(0);
	const [men, setMen] = (0, import_react.useState)(0);
	const [youth, setYouth] = (0, import_react.useState)(0);
	const [adults, setAdults] = (0, import_react.useState)(0);
	const [children, setChildren] = (0, import_react.useState)(0);
	const [disabled, setDisabled] = (0, import_react.useState)(0);
	const [indirect, setIndirect] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		listCooperatives({ data: {} }).then((rows) => {
			setCoops(rows.map((c) => ({
				id: c.id,
				name: c.name
			})));
			if (actor?.cooperativeId) setCooperativeId(actor.cooperativeId);
			else if (rows[0]) setCooperativeId(rows[0].id);
		});
	}, [actor?.cooperativeId]);
	async function save(submit) {
		if (!cooperativeId) return;
		setBusy(true);
		try {
			const res = await saveReport({ data: {
				cooperativeId,
				year,
				month,
				title,
				activitySummary,
				achievements,
				challenges,
				futureActions,
				women,
				men,
				youth,
				adults,
				children,
				disabled,
				indirect,
				submit
			} });
			toast.success(submit ? "Rapport soumis pour validation" : "Brouillon enregistré");
			navigate({
				to: "/rapports/$id",
				params: { id: String(res.id) }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Enregistrement impossible");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Nouveau rapport mensuel",
		description: "Renseignez l'activité, les effectifs et les perspectives."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-4 lg:grid-cols-3",
		onSubmit: (e) => e.preventDefault(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 lg:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Titre",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						required: true
					})
				}),
				actor?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Coopérative",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: cooperativeId ? String(cooperativeId) : "",
						onValueChange: (v) => setCooperativeId(Number(v)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choisir" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: coops.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: String(c.id),
							children: c.name
						}, c.id)) })]
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Année",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: year,
							onChange: (e) => setYear(Number(e.target.value))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mois",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							max: 12,
							value: month,
							onChange: (e) => setMonth(Number(e.target.value))
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Synthèse d'activité",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: activitySummary,
						onChange: (e) => setActivitySummary(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Réalisations",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: achievements,
						onChange: (e) => setAchievements(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Difficultés",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: challenges,
						onChange: (e) => setChallenges(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Actions à venir",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: futureActions,
						onChange: (e) => setFutureActions(e.target.value)
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 rounded-2xl bg-card p-5 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Effectifs du mois"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Femmes",
					value: women,
					set: setWomen
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Hommes",
					value: men,
					set: setMen
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Jeunes",
					value: youth,
					set: setYouth
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Adultes",
					value: adults,
					set: setAdults
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Enfants",
					value: children,
					set: setChildren
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Handicap",
					value: disabled,
					set: setDisabled
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Indirects",
					value: indirect,
					set: setIndirect
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void save(false),
						variant: "outline",
						children: "Enregistrer le brouillon"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void save(true),
						children: "Soumettre à l'administrateur"
					})]
				})
			]
		})]
	})] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function Num({ label, value, set }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "number",
			min: 0,
			value,
			onChange: (e) => set(Number(e.target.value))
		})
	});
}
//#endregion
export { NewReportPage as component };
