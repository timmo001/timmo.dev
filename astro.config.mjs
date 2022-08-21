import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  experimental: {
    integrations: true,
  },
  integrations: [preact(), sitemap(), robotsTxt()],
  output: "server",
  site: "https://timmo.dev",
});
