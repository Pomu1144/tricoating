import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {
  higgsfieldDesignInspectorVitePlugin,
  higgsfieldDesignSourceBabelPlugin,
} from "./src/module/design-inspector/vite";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

// `cloudflare:workers` is a workerd runtime built-in (it exposes the Worker env
// / bindings). It does not exist under plain `vite dev` on Node, and when the
// dep scanner cannot resolve it Vite skips ALL pre-bundling — which then leaves
// CommonJS deps like React unoptimized and crashes SSR ("module is not
// defined"). In dev we alias it to a tiny shim so the scanner resolves it and
// pre-bundling proceeds. The Worker build keeps the real module external (see
// `ssr.external` / `rollupOptions.external`), so production is untouched.
const CF_WORKERS_DEV_SHIM = fileURLToPath(
  new URL("./src/lib/cloudflare-workers.dev-shim.ts", import.meta.url),
);

export default defineConfig(({ mode, command }) => {
  const designInspectorEnabled = process.env.HF_DESIGN_INSPECTOR === "1" || mode === "design";

  return {
    resolve:
      command === "serve"
        ? { alias: [{ find: "cloudflare:workers", replacement: CF_WORKERS_DEV_SHIM }] }
        : undefined,
    // The server bundle runs as a Cloudflare Worker — there is no node_modules
    // at runtime. Vite's default SSR build leaves npm deps as bare external
    // imports (h3, react, @tanstack/*, seroval, …), which resolve on a Node
    // server but throw "No such module" in a Worker. Bundle them all in.
    // (node: builtins stay external — nodejs_compat provides them.)
    ssr: {
      // Bundle every npm dep into the Worker build. In dev the SSR runtime is
      // Node (with node_modules), so we leave `noExternal` at its default —
      // deps resolve from node_modules with correct CJS interop. Forcing
      // `noExternal: true` in dev makes Vite's module runner evaluate CommonJS
      // deps like React as raw CJS ("module is not defined").
      noExternal: command === "build" ? true : undefined,
      // `cloudflare:workers` is a workerd runtime built-in that exposes the Worker
      // env / bindings (D1 `DB`, R2 `STORAGE`). Like node: builtins it must NOT be
      // bundled; the runtime provides it. (`ssr.external` is typed string[].)
      external: ["cloudflare:workers"],
    },
    build: {
      // Keep `cloudflare:*` external in the SSR rollup pass too — `noExternal`
      // above would otherwise try to resolve+bundle it and fail.
      rollupOptions: { external: [/^cloudflare:/] },
    },
    plugins: [
      // Material Symbols SVGs (the app icon set) import as React components via
      // `?react`. `icon: true` sizes them 1em; fill is forced to currentColor so
      // they color like text (the raw SVGs have no fill attribute). Keep the
      // viewBox so CSS sizing scales the glyph.
      svgr({
        svgrOptions: {
          icon: true,
          svgProps: { fill: "currentColor" },
          svgoConfig: {
            plugins: [{ name: "preset-default", params: { overrides: { removeViewBox: false } } }],
          },
        },
      }),
      // TanStack Start plugin must run before React's plugin.
      //
      // SSR build: `vite build` emits a Workers-shaped server bundle
      // (dist/server/server.js — `export default { fetch }`) plus dist/client
      // (hashed static assets). The platform publishes that as a per-tenant
      // Worker on Workers for Platforms, served at <sub>.higgsfield.app/ (host
      // root, so Vite's default base "/" — no base-path juggling).
      //
      // Rendering happens on the server per request, so site code must be
      // SSR-safe: never touch browser-only globals (window, document,
      // localStorage, navigator) during render or at module top level — only
      // inside effects/handlers, or guarded with `typeof window !== "undefined"`.
      tanstackStart({
        server: { entry: "server" },
      }),
      higgsfieldDesignInspectorVitePlugin(designInspectorEnabled),
      react({
        babel: {
          plugins: designInspectorEnabled ? [higgsfieldDesignSourceBabelPlugin] : [],
        },
      }),
      tailwindcss(),
      tsconfigPaths(),
    ],
  };
});
