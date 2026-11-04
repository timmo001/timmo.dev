import type { APIRoute } from "astro";

import { getEnv } from "~/env";
import { getHaProjectKind } from "~/lib/ha-project-kinds";
import { LOCAL_DEMO_TAG } from "~/lib/ha-project-demo";
import { STATS_CACHE_TTL_SECONDS } from "~/lib/stats-cache";

export const prerender = false;

// A release asset or tag name: no slashes or dots that could leave the path.
const SAFE_NAME = /^[\w-][\w.-]*$/;

// Serves a card's release script from this site, as GitHub's release downloads
// send no CORS headers. Pages add the release tag as `?v=`, so the script comes
// straight from that release's download URL with no API call, and each release
// gets its own long-lived cache entry. Without `?v=` it's the latest release's.
export const GET: APIRoute = async ({ params, url }) => {
  const { repo, script } = params;
  const tag = url.searchParams.get("v");

  if (
    !repo ||
    !script ||
    !SAFE_NAME.test(repo) ||
    getHaProjectKind(repo) === null ||
    !script.endsWith(".js") ||
    !SAFE_NAME.test(script) ||
    (tag !== null && !SAFE_NAME.test(tag))
  ) {
    return new Response("Not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const env = getEnv();

  const release = tag
    ? `download/${encodeURIComponent(tag)}`
    : "latest/download";

  // A local checkout's build, which changes as it's rebuilt
  const local = tag === LOCAL_DEMO_TAG ? env.HA_DEMO_LOCAL_URL : undefined;

  const downloadUrl = local
    ? `${local}/${repo}/dist/${script}`
    : `https://github.com/${env.GITHUB_USERNAME}/${repo}/releases/${release}/${script}`;

  const response = await fetch(downloadUrl);

  if (!response.ok) {
    console.error(`Fetching ${downloadUrl} failed with ${response.status}`);
    // An unread body keeps its connection open
    await response.body?.cancel();

    return new Response(response.status === 404 ? "Not found" : "Bad gateway", {
      status: response.status === 404 ? 404 : 502,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // Without a tag the latest release can change, so keep that one short.
  const maxAge = tag
    ? STATS_CACHE_TTL_SECONDS * 24
    : STATS_CACHE_TTL_SECONDS / 6;

  return new Response(await response.arrayBuffer(), {
    headers: {
      "Content-Type": "text/javascript",
      "Cache-Control": local
        ? "no-store"
        : `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge}`,
    },
  });
};
