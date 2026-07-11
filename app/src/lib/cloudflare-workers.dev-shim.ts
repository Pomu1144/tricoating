// Dev-only stand-in for the `cloudflare:workers` runtime module, which only
// exists in the workerd runtime (the production Worker build / `wrangler dev`).
// Under plain `vite dev` (Node) there are no Worker bindings, so `env` is an
// empty object. vite.config.ts aliases `cloudflare:workers` to this file only
// when `command === "serve"`; the Worker build keeps the real module external
// (see `ssr.external` / `rollupOptions.external`), so production is unaffected.
export const env = {};
