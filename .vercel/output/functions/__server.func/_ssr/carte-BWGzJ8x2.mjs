import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { g as formatNumber, r as COOP_STATUSES } from "./utils-BYOSEtN8.mjs";
import { d as listCooperatives, h as listOdds, p as listFilterOptions } from "./api-DTT0YQAC.mjs";
import { t as PageHeader } from "./page-header-DjF36rJK.mjs";
import { t as Card } from "./card-Dg3Hlph1.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BXYo9c-Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/carte-BWGzJ8x2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MoroccoMap({ cooperatives }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[520px] w-full animate-pulse rounded-2xl bg-muted" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeafletMap, {
		cooperatives,
		onOpen: (id) => navigate({
			to: "/cooperatives/$id",
			params: { id: String(id) }
		})
	});
}
function LeafletMap({ cooperatives, onOpen }) {
	(0, import_react.useMemo)(() => {
		return null;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapInner, {
		cooperatives,
		onOpen
	});
}
function MapInner({ cooperatives, onOpen }) {
	const [Lmod, setLmod] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		Promise.all([
			import("../_libs/leaflet+react-leaflet__core.mjs").then((n) => /* @__PURE__ */ __toESM(n.b())),
			import("../_libs/react-leaflet.mjs").then((n) => n.t),
			Promise.resolve({})
		]).then(([L, rl]) => {
			const icon = L.divIcon({
				className: "coop-marker",
				html: `<span class="coop-marker-dot"></span>`,
				iconSize: [16, 16],
				iconAnchor: [8, 8],
				popupAnchor: [0, -8]
			});
			L.Marker.prototype.options.icon = icon;
			setLmod(rl);
		});
	}, []);
	if (!Lmod) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[520px] w-full animate-pulse rounded-2xl bg-muted" });
	const { MapContainer, TileLayer, Marker, Popup } = Lmod;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapContainer, {
		center: [31.8, -7.1],
		zoom: 6,
		className: "h-[520px] w-full rounded-2xl",
		scrollWheelZoom: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
			attribution: "© OpenStreetMap © CARTO",
			url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
		}), cooperatives.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, {
			position: [c.lat, c.lng],
			eventHandlers: { click: () => onOpen(c.id) },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-44 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: c.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							c.city,
							" · ",
							c.region
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs",
						children: [
							c.sector,
							" · ",
							c.status === "active" ? "Active" : c.status
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs tabular-nums",
						children: [formatNumber(c.totalDirect), " bénéficiaires"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs",
						children: c.odds.map((o) => `ODD ${o.code}`).join(" · ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 text-xs font-medium text-primary",
						onClick: () => onOpen(c.id),
						children: "Ouvrir le profil"
					})
				]
			}) })
		}, c.id))]
	});
}
function MapPage() {
	const [all, setAll] = (0, import_react.useState)([]);
	const [region, setRegion] = (0, import_react.useState)("all");
	const [sector, setSector] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [odd, setOdd] = (0, import_react.useState)("all");
	const [options, setOptions] = (0, import_react.useState)({
		regions: [],
		sectors: []
	});
	const [odds, setOdds] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listCooperatives({ data: {} }).then(setAll);
		listFilterOptions().then((o) => setOptions({
			regions: o.regions,
			sectors: o.sectors
		}));
		listOdds().then(setOdds);
	}, []);
	const filtered = (0, import_react.useMemo)(() => all.filter((c) => {
		if (region !== "all" && c.region !== region) return false;
		if (sector !== "all" && c.sector !== sector) return false;
		if (status !== "all" && c.status !== status) return false;
		if (odd !== "all" && !c.odds.some((o) => o.code === Number(odd))) return false;
		return true;
	}), [
		all,
		region,
		sector,
		status,
		odd
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Carte des coopératives",
			description: `${filtered.length} marqueurs · survolez un point pour le détail, cliquez pour ouvrir le profil.`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
			children: [
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Activité" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "Toutes les activités"
					}), options.sectors.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: r,
						children: r
					}, r))] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "overflow-hidden p-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoroccoMap, { cooperatives: filtered })
		})
	] });
}
//#endregion
export { MapPage as component };
