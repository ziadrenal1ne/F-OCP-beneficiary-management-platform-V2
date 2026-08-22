import { createServerFn } from "@tanstack/react-start";
import { ensureSeeded } from "./seed";

export const bootstrapDemo = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeeded();
  return { ok: true as const };
});
