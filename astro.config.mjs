// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";

import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
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
  // Alchemy's deploy builds with its own Cloudflare adapter and fails on a
  // declared one, so alchemy.run.ts sets ALCHEMY_ASTRO_BUILD for its builds
  adapter:
    process.env.ALCHEMY_ASTRO_BUILD === "1"
      ? undefined
      : cloudflare({ imageService: "compile" }),
  session: {
    driver: sessionDrivers.lruCache({ max: 100 }),
  },
  vite: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  },
});
