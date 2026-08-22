import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { d as cn } from "./utils-BYOSEtN8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-Cxa23Bc6.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "bg-primary/10 text-primary",
		secondary: "bg-secondary text-secondary-foreground",
		outline: "border border-border text-foreground",
		success: "bg-primary/10 text-primary",
		warning: "bg-warning/15 text-warning",
		danger: "bg-destructive/10 text-destructive",
		muted: "bg-muted text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var MAP = {
	active: {
		label: "Active",
		variant: "success"
	},
	pending: {
		label: "En attente",
		variant: "warning"
	},
	suspended: {
		label: "Suspendue",
		variant: "muted"
	},
	draft: {
		label: "Brouillon",
		variant: "muted"
	},
	submitted: {
		label: "Soumis",
		variant: "warning"
	},
	approved: {
		label: "Approuvé",
		variant: "success"
	},
	rejected: {
		label: "Rejeté",
		variant: "danger"
	},
	expiring: {
		label: "Expire bientôt",
		variant: "warning"
	},
	expired: {
		label: "Expirée",
		variant: "danger"
	}
};
function StatusBadge({ value }) {
	const item = MAP[value] ?? {
		label: value,
		variant: "secondary"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: item.variant,
		children: item.label
	});
}
//#endregion
export { StatusBadge as t };
