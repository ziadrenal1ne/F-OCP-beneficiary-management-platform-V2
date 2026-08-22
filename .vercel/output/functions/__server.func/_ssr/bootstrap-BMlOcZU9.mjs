import { r as createServerFn } from "./ssr.mjs";
import { n as ensureSeeded, t as createServerRpc } from "./seed-De06I9Hj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bootstrap-BMlOcZU9.js
var bootstrapDemo_createServerFn_handler = createServerRpc({
	id: "aed69a8d3bfec4b52a0665835cdf71f0f35396b233d4487c9a908a767e72a876",
	name: "bootstrapDemo",
	filename: "src/lib/server/bootstrap.ts"
}, (opts) => bootstrapDemo.__executeServer(opts));
var bootstrapDemo = createServerFn({ method: "GET" }).handler(bootstrapDemo_createServerFn_handler, async () => {
	await ensureSeeded();
	return { ok: true };
});
//#endregion
export { bootstrapDemo_createServerFn_handler };
