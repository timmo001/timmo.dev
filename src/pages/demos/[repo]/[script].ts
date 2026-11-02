import type { APIRoute, GetStaticPaths } from "astro";

import { getHaProjectDemos } from "~/lib/ha-projects";

// Serves the script from the project's latest release, so that the demo loads
// it from this site rather than from GitHub, which sends no CORS headers.
export const getStaticPaths = (async () =>
  (await getHaProjectDemos()).map(({ repoName, demo }) => ({
    params: { repo: repoName, script: demo.script.name },
    props: { downloadUrl: demo.script.downloadUrl },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ downloadUrl: string }> = async ({ props }) => {
  const response = await fetch(props.downloadUrl);

  if (!response.ok) {
    throw new Error(
      `Fetching ${props.downloadUrl} failed with ${response.status}`,
    );
  }

  return new Response(await response.arrayBuffer(), {
    headers: { "Content-Type": "text/javascript" },
  });
};
