import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as getMe } from "./api-DTT0YQAC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-actor-DJG9MvAJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useActor() {
	const [actor, setActor] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		getMe().then((a) => {
			if (!cancelled) setActor(a);
		}).catch((err) => {
			if (!cancelled) setError(err instanceof Error ? err.message : "Erreur");
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	return {
		actor,
		loading,
		error
	};
}
//#endregion
export { useActor as t };
