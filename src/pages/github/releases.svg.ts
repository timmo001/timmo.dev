import type { APIRoute } from "astro";

import { getUsername } from "~/lib/github";
import {
  renderErrorCard,
  renderReleasesCard,
  svgResponse,
} from "~/lib/github-card";
import { getLatestReleases } from "~/server/github-readme";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    return svgResponse(
      renderReleasesCard({ items: await getLatestReleases(username) }),
    );
  } catch (error) {
    console.error(error);

    return svgResponse(renderErrorCard("Latest releases"), 60);
  }
}) satisfies APIRoute;
