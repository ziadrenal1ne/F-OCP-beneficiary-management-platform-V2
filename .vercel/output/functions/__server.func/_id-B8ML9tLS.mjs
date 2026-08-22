import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "./_libs/@radix-ui/react-checkbox+[...].mjs";
import { g as formatNumber, h as formatMonth } from "./_ssr/utils-BYOSEtN8.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { n as Route$2 } from "./_ssr/router-AyguLxs4.mjs";
import { t as Button } from "./_ssr/button-DH4wG0kz.mjs";
import { b as reviewReport, s as getReport } from "./_ssr/api-DTT0YQAC.mjs";
import { t as useActor } from "./_ssr/use-actor-DJG9MvAJ.mjs";
import { t as PageHeader } from "./_ssr/page-header-DjF36rJK.mjs";
import { t as Card } from "./_ssr/card-Dg3Hlph1.mjs";
import { t as Label } from "./_ssr/label-CFyTbLln.mjs";
import { t as StatusBadge } from "./_ssr/status-badge-Cxa23Bc6.mjs";
import { t as Textarea } from "./_ssr/textarea-BNhrVoXh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-B8ML9tLS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportDetailPage() {
	const { id } = Route$2.useParams();
	const reportId = Number(id);
	const { actor } = useActor();
	const navigate = useNavigate();
	const [report, setReport] = (0, import_react.useState)(null);
	const [comment, setComment] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getReport({ data: { id: reportId } }).then(setReport);
	}, [reportId]);
	if (!report) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Chargement…"
	});
	async function decide(decision) {
		try {
			await reviewReport({ data: {
				id: reportId,
				decision,
				comment
			} });
			toast.success(decision === "approved" ? "Rapport approuvé" : "Rapport rejeté");
			navigate({ to: "/rapports" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Action impossible");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: report.cooperativeName,
		title: report.title,
		description: formatMonth(report.year, report.month),
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: report.status })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5 lg:col-span-2 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					title: "Synthèse d'activité",
					body: report.activitySummary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					title: "Réalisations",
					body: report.achievements
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					title: "Difficultés",
					body: report.challenges
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					title: "Actions à venir",
					body: report.futureActions
				}),
				report.reviewComment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					title: "Commentaire de revue",
					body: report.reviewComment
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
					children: "Bénéficiaires déclarés"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-3 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Femmes",
							v: report.women
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Hommes",
							v: report.men
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Jeunes",
							v: report.youth
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Adultes",
							v: report.adults
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Enfants",
							v: report.children
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Handicap",
							v: report.disabled
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Indirects",
							v: report.indirect
						})
					]
				})]
			}), actor?.role === "admin" && report.status === "submitted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Commentaire de validation" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: comment,
						onChange: (e) => setComment(e.target.value),
						placeholder: "Motif, recommandations…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => void decide("approved"),
							children: "Approuver"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							onClick: () => void decide("rejected"),
							children: "Rejeter"
						})]
					})
				]
			}) : null]
		})]
	})] });
}
function Block({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "text-sm font-medium",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-sm leading-relaxed text-muted-foreground",
		children: body || "—"
	})] });
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "tabular-nums",
			children: formatNumber(v)
		})]
	});
}
//#endregion
export { ReportDetailPage as component };
