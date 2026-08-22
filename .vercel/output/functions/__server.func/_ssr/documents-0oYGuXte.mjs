import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as DOCUMENT_CATEGORIES, g as formatNumber, m as formatDate } from "./utils-BYOSEtN8.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DH4wG0kz.mjs";
import { T as uploadDocument, a as getDocumentContent, d as listCooperatives, f as listDocuments, y as reviewDocument } from "./api-DTT0YQAC.mjs";
import { t as useActor } from "./use-actor-DJG9MvAJ.mjs";
import { t as PageHeader } from "./page-header-DjF36rJK.mjs";
import { t as Label } from "./label-CFyTbLln.mjs";
import { t as StatusBadge } from "./status-badge-Cxa23Bc6.mjs";
import { t as Input } from "./input-Cj9iy2dH.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BXYo9c-Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-0oYGuXte.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DocumentsPage() {
	const { actor } = useActor();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [coops, setCoops] = (0, import_react.useState)([]);
	const [cooperativeId, setCooperativeId] = (0, import_react.useState)(null);
	const [category, setCategory] = (0, import_react.useState)(DOCUMENT_CATEGORIES[0]);
	const [preview, setPreview] = (0, import_react.useState)(null);
	function reload() {
		listDocuments().then(setRows);
	}
	(0, import_react.useEffect)(() => {
		reload();
		listCooperatives({ data: {} }).then((c) => {
			setCoops(c.map((x) => ({
				id: x.id,
				name: x.name
			})));
			setCooperativeId(actor?.cooperativeId ?? c[0]?.id ?? null);
		});
	}, [actor?.cooperativeId]);
	async function onFile(file) {
		if (!cooperativeId) return;
		if (file.size > 15e5) {
			toast.error("Fichier trop volumineux (max 1,5 Mo)");
			return;
		}
		const contentBase64 = await fileToBase64(file);
		try {
			await uploadDocument({ data: {
				cooperativeId,
				name: file.name,
				category,
				mimeType: file.type || "application/octet-stream",
				contentBase64,
				sizeBytes: file.size
			} });
			toast.success("Document téléversé");
			reload();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Téléversement impossible");
		}
	}
	async function openDoc(id) {
		try {
			const doc = await getDocumentContent({ data: { id } });
			if (!doc.contentBase64) {
				toast.message("Aperçu indisponible", { description: "Ce document de démonstration n'a pas de fichier joint." });
				return;
			}
			const url = `data:${doc.mimeType};base64,${doc.contentBase64}`;
			setPreview({
				name: doc.name,
				mimeType: doc.mimeType,
				url
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Lecture impossible");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Documents",
			description: "PDF, CSV, Excel et images — versioning, statut et aperçu."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mb-6 grid gap-3 rounded-2xl bg-card p-5 shadow-card sm:grid-cols-3",
			children: [
				actor?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Coopérative" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: cooperativeId ? String(cooperativeId) : "",
						onValueChange: (v) => setCooperativeId(Number(v)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: coops.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: String(c.id),
							children: c.name
						}, c.id)) })]
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Catégorie" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: category,
						onValueChange: setCategory,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DOCUMENT_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c,
							children: c
						}, c)) })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Fichier" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "file",
						accept: ".pdf,.csv,.xls,.xlsx,image/*",
						onChange: (e) => {
							const f = e.target.files?.[0];
							if (f) onFile(f);
						}
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-2xl bg-card shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[800px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-border text-xs uppercase text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Nom",
						"Coopérative",
						"Catégorie",
						"Version",
						"Statut",
						"Date",
						""
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: h
					}, h)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-left font-medium hover:underline",
								onClick: () => void openDoc(d.id),
								children: d.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [formatNumber(d.sizeBytes), " octets"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: d.cooperativeName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: d.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 tabular-nums",
							children: ["v", d.version]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: d.status })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: formatDate(d.uploadedAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => void openDoc(d.id),
									children: "Aperçu"
								}), actor?.role === "admin" && d.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => void reviewDocument({ data: {
										id: d.id,
										status: "approved"
									} }).then(reload),
									children: "Valider"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "destructive",
									onClick: () => void reviewDocument({ data: {
										id: d.id,
										status: "rejected"
									} }).then(reload),
									children: "Rejeter"
								})] }) : null]
							})
						})
					]
				}, d.id)) })]
			})
		}),
		preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4",
			onClick: () => setPreview(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-card p-4 shadow-card",
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: preview.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: preview.url,
							download: preview.name,
							className: "text-sm text-primary",
							children: "Télécharger"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => setPreview(null),
							children: "Fermer"
						})]
					})]
				}), preview.mimeType.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: preview.url,
					alt: "",
					className: "max-h-[70vh] w-full object-contain"
				}) : preview.mimeType === "application/pdf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: preview.name,
					src: preview.url,
					className: "h-[70vh] w-full rounded-lg bg-muted"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Aperçu non disponible pour ce type — utilisez Télécharger."
				})]
			})
		}) : null
	] });
}
function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const res = String(reader.result ?? "");
			const comma = res.indexOf(",");
			resolve(comma >= 0 ? res.slice(comma + 1) : res);
		};
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}
//#endregion
export { DocumentsPage as component };
