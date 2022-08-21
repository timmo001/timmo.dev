import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  experimental: {
    integrations: true,
  },
  integrations: [preact(), robotsTxt(), sitemap()],
  site: "https://timmo.dev",
});
