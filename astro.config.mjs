// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";

import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import { STATS_CACHE_TTL_SECONDS } from "./src/lib/stats-cache.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://timmo.dev",
  integrations: [sitemap()],
  adapter: vercel({
    isr: {
      expiration: STATS_CACHE_TTL_SECONDS,
    },
  }),
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  },
});
