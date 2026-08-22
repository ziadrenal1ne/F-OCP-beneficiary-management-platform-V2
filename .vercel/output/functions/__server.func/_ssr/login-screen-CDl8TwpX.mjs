import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { i as DEMO_ACCOUNTS, n as APP_NAME, s as ORG_NAME } from "./utils-BYOSEtN8.mjs";
import { t as GROK_PROVIDERS } from "./server-Qpe1H4Ya.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as Button } from "./button-DH4wG0kz.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as Label } from "./label-CFyTbLln.mjs";
import { t as Input } from "./input-Cj9iy2dH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-screen-CDl8TwpX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var bootstrapDemo = createServerFn({ method: "GET" }).handler(createSsrRpc("aed69a8d3bfec4b52a0665835cdf71f0f35396b233d4487c9a908a767e72a876"));
function LoginScreen() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("admin@focp.local");
	const [password, setPassword] = (0, import_react.useState)("admin123");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		bootstrapDemo().then(() => setReady(true)).catch(() => setReady(true));
	}, []);
	if (!isPending && user) navigate({ to: "/tableau" });
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		const { error: err } = await authClient.signIn.email({
			email,
			password,
			callbackURL: "/tableau"
		});
		if (err) {
			setError(err.message ?? "Identifiants incorrects");
			setBusy(false);
			return;
		}
		window.location.href = "/tableau";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-screen overflow-hidden bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_55%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden lg:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: ORG_NAME
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-foreground xl:text-5xl",
						children: ["Plateforme de gestion des bénéficiaires", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-primary",
							children: "Axe Éco-Social"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-md text-sm leading-relaxed text-muted-foreground",
						children: "Centralisez les coopératives, les statistiques de bénéficiaires, les ODD, les conventions et le cycle de validation des rapports mensuels."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-10 grid max-w-md grid-cols-3 gap-4",
						children: [
							["1 700+", "coopératives cibles"],
							["12", "régions"],
							["17", "ODD suivis"]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-display text-2xl font-medium tabular-nums",
							children: k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-xs text-muted-foreground",
							children: v
						})] }, v))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: ORG_NAME
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-3xl font-medium",
						children: APP_NAME
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-card p-6 shadow-card sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-medium",
							children: "Connexion"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Espace réservé aux équipes de la Fondation."
						}),
						!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: "Préparation de l'espace de démonstration…"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-6 space-y-4",
							onSubmit: (e) => void onSubmit(e),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "E-mail"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										autoComplete: "username",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: "Mot de passe"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										autoComplete: "current-password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										required: true
									})]
								}),
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-destructive",
									children: error
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full",
									disabled: busy || !ready,
									children: busy ? "Connexion…" : "Se connecter"
								})
							]
						}),
						GROK_PROVIDERS.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-center text-xs text-muted-foreground",
								children: "ou continuer avec"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2",
								children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => void signIn(p.providerId, { callbackURL: "/tableau" }),
									children: ["Continuer avec ", p.label]
								}, p.providerId))
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-2 rounded-xl bg-muted/70 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Comptes de démonstration"
							}), DEMO_ACCOUNTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex w-full flex-col rounded-lg bg-card px-3 py-2 text-left text-xs shadow-card hover:bg-accent",
								onClick: () => {
									setEmail(a.email);
									setPassword(a.password);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: a.role
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										a.email,
										" · ",
										a.password
									]
								})]
							}, a.email))]
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { LoginScreen as t };
