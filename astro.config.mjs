// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";

import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, sessionDrivers } from "astro/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://timmo.dev",
  redirects: {
    "/work": "/projects",
    "/what-i-do": "/projects",
    "/projects-and-contributions": "/projects",
  },
  integrations: [sitemap()],
  adapter: cloudflare({ imageService: "compile" }),
  session: {
    driver: sessionDrivers.lruCache({ max: 100 }),
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  },
});
