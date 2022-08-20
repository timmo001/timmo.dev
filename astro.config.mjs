import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  site: "https://timmo.dev",
  experimental: {
    integrations: true,
  },
  integrations: [preact({ compat: true }), sitemap(), robotsTxt()],
});
