/**
 * The site's infrastructure as an Alchemy stack: the Astro site as the
 * `timmo-dev` Worker at timmo.dev, and the `timmo-dev-www-redirect` Worker
 * sending www.timmo.dev there. Deploy it with `mise run deploy`.
 *
 * Any other stage, such as `pr-123`, deploys the site as a Preview of the prod
 * Worker, with no custom domain and no redirect Worker.
 */
import * as Cloudflare from "@alchemy.run/cloudflare";
import * as Alchemy from "alchemy";
import * as Effect from "effect/Effect";

const compatibility = { date: "2026-07-17" };

// astro.config.mjs leaves out its @astrojs/cloudflare adapter, used by
// `astro dev` and `astro build`, when Alchemy builds the site with its own
process.env.ALCHEMY_ASTRO_BUILD = "1";

export default Alchemy.Stack(
  "timmo-dev",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const { stage } = yield* Alchemy.Stack;

    // GITHUB_TOKEN stays a Worker secret set outside the stack: Cloudflare
    // keeps secrets a deploy doesn't declare. The site keeps its own
    // in-memory session driver, so no session KV namespace is needed
    const siteProps = {
      compatibility,
      sessionKVBindingName: false,
      cache: { enabled: true },
    } as const;

    if (stage !== "prod") {
      const prod = yield* Cloudflare.Worker.ref("Site", { stage: "prod" });

      const site = yield* Cloudflare.Website.Astro("Site", {
        ...siteProps,
        preview: { of: prod },
      });

      return { url: site.url };
    }

    // Both Workers were deployed by Wrangler before this stack, so they're
    // adopted rather than failing as someone else's
    const site = yield* Cloudflare.Website.Astro("Site", {
      ...siteProps,
      name: "timmo-dev",
      domain: "timmo.dev",
    }).pipe(Alchemy.AdoptPolicy.adopt(true));

    const redirect = yield* Cloudflare.Worker("WwwRedirect", {
      name: "timmo-dev-www-redirect",
      main: "redirect-worker/index.ts",
      compatibility,
      domain: "www.timmo.dev",
      workersDev: false,
    }).pipe(Alchemy.AdoptPolicy.adopt(true));

    return { url: site.url, redirectUrl: redirect.url };
  }),
);
