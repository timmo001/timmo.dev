import type { APIRoute } from "astro";

import { getUsername } from "~/lib/github";
import {
  renderErrorCard,
  renderStatsCard,
  svgResponse,
} from "~/lib/github-card";
import { getProfileStats } from "~/server/github";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    return svgResponse(
      renderStatsCard(username, await getProfileStats(username)),
    );
  } catch {
    return svgResponse(renderErrorCard("GitHub stats"), 60);
  }
}) satisfies APIRoute;
