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
      renderStatsCard(
        username,
        await getProfileStats(username),
        new Date().getUTCFullYear(),
      ),
    );
  } catch {
    return svgResponse(renderErrorCard("GitHub stats"), 60);
  }
}) satisfies APIRoute;
