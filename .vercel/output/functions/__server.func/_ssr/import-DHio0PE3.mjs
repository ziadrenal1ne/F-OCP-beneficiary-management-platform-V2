import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as importCooperativesCsv } from "./api-DTT0YQAC.mjs";
import { t as useActor } from "./use-actor-DJG9MvAJ.mjs";
import { t as PageHeader } from "./page-header-DjF36rJK.mjs";
import { t as Card } from "./card-Dg3Hlph1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-DHio0PE3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImportPage() {
	const { actor, loading } = useActor();
	const navigate = useNavigate();
	const [result, setResult] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!loading && actor && actor.role !== "admin") navigate({ to: "/tableau" });
	async function run(text) {
		setBusy(true);
		try {
			const res = await importCooperativesCsv({ data: { csv: text } });
			setResult(res);
			if (res.inserted) toast.success(`${res.inserted} coopérative(s) importée(s)`);
			if (res.errors.length) toast.error(`${res.errors.length} ligne(s) en erreur`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Import impossible");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Import CSV",
			description: "Colonnes obligatoires : name, city, region, sector. Optionnelles : province, address, lat, lng, phone, email, website, status, description, legal_status, country."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: ".csv,text/csv",
				className: "block w-full text-sm",
				onChange: (e) => {
					const f = e.target.files?.[0];
					if (!f) return;
					const reader = new FileReader();
					reader.onload = () => void run(String(reader.result ?? ""));
					reader.readAsText(f);
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/sample-cooperatives.csv",
				download: true,
				className: "mt-3 inline-block text-sm text-primary",
				children: "Télécharger un CSV modèle"
			})]
		}),
		result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm",
				children: ["Insertions : ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium tabular-nums",
					children: result.inserted
				})]
			}), result.errors.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1 text-sm text-destructive",
				children: result.errors.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					"Ligne ",
					e.row,
					" — ",
					e.message
				] }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Aucune erreur de validation."
			})]
		}) : null
	] });
}
//#endregion
export { ImportPage as component };
