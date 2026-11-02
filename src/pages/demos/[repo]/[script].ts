import type { APIRoute } from "astro";

import { getHaProjectDemos } from "~/lib/ha-projects";
import { STATS_CACHE_TTL_SECONDS } from "~/lib/stats-cache";

export const prerender = false;

// Serves the script from the project's latest release, so that the demo loads
// it from this site rather than from GitHub, which sends no CORS headers. Pages
// add the release tag as `?v=`, so a release's script can be cached for long.
export const GET: APIRoute = async ({ params }) => {
  const demo = (await getHaProjectDemos()).find(
    (entry) =>
      entry.repoName === params.repo && entry.demo.script.name === params.script,
  )?.demo;

  if (!demo) {
    return new Response("Not found", { status: 404 });
  }

  const response = await fetch(demo.script.downloadUrl);

  if (!response.ok) {
    console.error(
      `Fetching ${demo.script.downloadUrl} failed with ${response.status}`,
    );

    return new Response("Bad gateway", {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(await response.arrayBuffer(), {
    headers: {
      "Content-Type": "text/javascript",
      "Cache-Control": `public, s-maxage=${STATS_CACHE_TTL_SECONDS * 24}, stale-while-revalidate=${STATS_CACHE_TTL_SECONDS * 24}`,
    },
  });
};
