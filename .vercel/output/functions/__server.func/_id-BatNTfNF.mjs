import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime, n as CheckboxIndicator, t as Checkbox$1 } from "./_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as REGIONS, d as cn, g as formatNumber, m as formatDate, r as COOP_STATUSES, u as SECTORS, x as monthLabel } from "./_ssr/utils-BYOSEtN8.mjs";
import { C as Check } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { r as Route$4 } from "./_ssr/router-AyguLxs4.mjs";
import { t as Button } from "./_ssr/button-DH4wG0kz.mjs";
import { C as sendAdminMessage, h as listOdds, r as getCooperative, w as updateCooperative } from "./_ssr/api-DTT0YQAC.mjs";
import { t as useActor } from "./_ssr/use-actor-DJG9MvAJ.mjs";
import { t as PageHeader } from "./_ssr/page-header-DjF36rJK.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./_ssr/card-Dg3Hlph1.mjs";
import { t as Label } from "./_ssr/label-CFyTbLln.mjs";
import { t as StatusBadge } from "./_ssr/status-badge-Cxa23Bc6.mjs";
import { t as Textarea } from "./_ssr/textarea-BNhrVoXh.mjs";
import { n as tooltipStyle } from "./_ssr/chart-theme-BWKCHhfh.mjs";
import { t as Input } from "./_ssr/input-Cj9iy2dH.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-BXYo9c-Y.mjs";
import { a as XAxis, d as ResponsiveContainer, f as Tooltip, i as YAxis, o as Area, s as CartesianGrid, t as AreaChart } from "./_libs/recharts+[...].mjs";
import { t as useForm } from "./_libs/react-hook-form.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "./_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BatNTfNF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("peer h-4 w-4 shrink-0 rounded-sm border border-input bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: "flex items-center justify-center text-current",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-10 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-card", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-4 focus-visible:outline-none", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function CoopProfilePage() {
	const { id } = Route$4.useParams();
	const coopId = Number(id);
	const { actor } = useActor();
	const [pack, setPack] = (0, import_react.useState)(null);
	const [odds, setOdds] = (0, import_react.useState)([]);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [msgTitle, setMsgTitle] = (0, import_react.useState)("Message de l'administrateur");
	const [msgBody, setMsgBody] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getCooperative({ data: { id: coopId } }).then(setPack);
		listOdds().then(setOdds);
	}, [coopId]);
	if (!pack) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Chargement du profil…"
	});
	const c = pack.cooperative;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: `${c.city} · ${c.region}`,
			title: c.name,
			description: c.description,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: c.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => setEditing((v) => !v),
				children: editing ? "Fermer" : "Modifier"
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				["Bénéficiaires", formatNumber(c.totalDirect)],
				["Femmes", formatNumber(c.women)],
				["Jeunes", formatNumber(c.youth)],
				["Indirects", formatNumber(c.indirect)]
			].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl tabular-nums",
					children: v
				})]
			}, k))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "infos",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "flex flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "infos",
							children: "Informations"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "benef",
							children: "Bénéficiaires"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "rapports",
							children: "Rapports"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "docs",
							children: "Documents"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "esg",
							children: "ESG"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "infos",
					children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditForm, {
						cooperative: c,
						oddCodes: c.odds.map((o) => o.code),
						catalog: odds,
						isAdmin: actor?.role === "admin",
						onSaved: () => {
							setEditing(false);
							getCooperative({ data: { id: coopId } }).then(setPack);
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "Adresse",
										v: c.address
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "Ville",
										v: c.city
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "Province",
										v: c.province
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "Région",
										v: c.region
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "Pays",
										v: c.country
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "GPS",
										v: `${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "Téléphone",
										v: c.phone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "E-mail",
										v: c.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "Site web",
										v: c.website || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "Secteur",
										v: c.sector
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "Statut juridique",
										v: c.legalStatus
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										k: "Date de création",
										v: formatDate(c.createdDate)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-1",
								children: c.odds.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-muted px-2.5 py-1 text-xs",
									children: [
										"ODD ",
										o.code,
										" · ",
										o.shortName
									]
								}, o.id))
							}),
							actor?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-6 space-y-2 rounded-xl bg-muted/60 p-4",
								onSubmit: (e) => {
									e.preventDefault();
									sendAdminMessage({ data: {
										cooperativeId: c.id,
										title: msgTitle,
										body: msgBody
									} }).then(() => {
										toast.success("Message envoyé");
										setMsgBody("");
									}).catch((err) => toast.error(err instanceof Error ? err.message : "Erreur"));
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: "Envoyer un message à la coopérative"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: msgTitle,
										onChange: (e) => setMsgTitle(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: msgBody,
										onChange: (e) => setMsgBody(e.target.value),
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										children: "Envoyer"
									})
								]
							}) : null
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "benef",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Évolution" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: pack.months.map((m) => ({
									label: monthLabel(m.month),
									femmes: m.women,
									hommes: m.men
								})),
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
									})
								]
							})
						})
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "rapports",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: pack.reports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/rapports/$id",
							params: { id: String(r.id) },
							className: "flex items-center justify-between rounded-xl bg-card p-4 shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: r.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: formatDate(r.createdAt)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: r.status })]
						}, r.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "docs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: pack.documents.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl bg-card p-4 shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: d.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									d.category,
									" · v",
									d.version
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: d.status })]
						}, d.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "esg",
					children: pack.esg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Score environnemental",
									v: pack.esg.environmentalScore.toFixed(1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Score social",
									v: pack.esg.socialScore.toFixed(1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Score gouvernance",
									v: pack.esg.governanceScore.toFixed(1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Eau économisée",
									v: `${formatNumber(pack.esg.waterSavedM3)} m³`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Énergie renouvelable",
									v: `${formatNumber(pack.esg.renewableEnergyKwh)} kWh`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Emplois créés",
									v: formatNumber(pack.esg.jobsCreated)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Heures de formation",
									v: formatNumber(pack.esg.trainingHours)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: pack.esg.notes
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Pas d'indicateurs ESG."
					})
				})
			]
		})
	] });
}
function Item({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted-foreground",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "text-sm",
		children: v
	})] });
}
function EditForm({ cooperative, oddCodes, catalog, isAdmin, onSaved }) {
	const { register, handleSubmit } = useForm({ defaultValues: {
		name: cooperative.name,
		description: cooperative.description,
		address: cooperative.address,
		city: cooperative.city,
		province: cooperative.province,
		region: cooperative.region,
		country: cooperative.country,
		lat: cooperative.lat,
		lng: cooperative.lng,
		phone: cooperative.phone,
		email: cooperative.email,
		website: cooperative.website,
		sector: cooperative.sector,
		legalStatus: cooperative.legalStatus,
		createdDate: cooperative.createdDate ?? "",
		status: cooperative.status
	} });
	const [selectedOdds, setSelectedOdds] = (0, import_react.useState)(oddCodes);
	const [sector, setSector] = (0, import_react.useState)(cooperative.sector);
	const [region, setRegion] = (0, import_react.useState)(cooperative.region);
	const [status, setStatus] = (0, import_react.useState)(cooperative.status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-4 rounded-2xl bg-card p-5 shadow-card sm:grid-cols-2",
		onSubmit: handleSubmit((values) => {
			updateCooperative({ data: {
				id: cooperative.id,
				...values,
				lat: Number(values.lat),
				lng: Number(values.lng),
				createdDate: values.createdDate || null,
				sector,
				region,
				status,
				oddCodes: selectedOdds
			} }).then(() => {
				toast.success("Profil enregistré");
				onSaved();
			}).catch((err) => toast.error(err instanceof Error ? err.message : "Erreur"));
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nom",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...register("name", { required: true }) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "E-mail",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "email",
					...register("email")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sm:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Description",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, { ...register("description") })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Adresse",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...register("address") })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Ville",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...register("city") })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Province",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...register("province") })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Pays",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...register("country") })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Région",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: region,
					onValueChange: setRegion,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: r,
						children: r
					}, r)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Secteur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: sector,
					onValueChange: setSector,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SECTORS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: r,
						children: r
					}, r)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Latitude",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					step: "0.0001",
					...register("lat", { valueAsNumber: true })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Longitude",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					step: "0.0001",
					...register("lng", { valueAsNumber: true })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Téléphone",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...register("phone") })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Site web",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...register("website") })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Statut juridique",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...register("legalStatus") })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Date de création",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					...register("createdDate")
				})
			}),
			isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Statut",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: status,
					onValueChange: (v) => setStatus(v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: COOP_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: s.value,
						children: s.label
					}, s.value)) })]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sm:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Objectifs de développement durable" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid gap-2 sm:grid-cols-2",
					children: catalog.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: selectedOdds.includes(o.code),
								onCheckedChange: (ck) => {
									setSelectedOdds((prev) => ck ? [...prev, o.code] : prev.filter((x) => x !== o.code));
								}
							}),
							"ODD ",
							o.code,
							" — ",
							o.nameFr
						]
					}, o.code))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sm:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Enregistrer"
				})
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { CoopProfilePage as component };
