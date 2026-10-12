import type { APIRoute } from "astro";

import { getUsername } from "~/lib/github";
import {
  errorCard,
  releasesCard,
  renderCard,
  svgResponse,
} from "~/lib/github-card";
import { getLatestReleases } from "~/server/github-readme";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    return svgResponse(
      renderCard(releasesCard({ items: await getLatestReleases(username) })),
    );
  } catch (error) {
    console.error(error);

    return svgResponse(renderCard(errorCard("Latest releases")), 60);
  }
}) satisfies APIRoute;
