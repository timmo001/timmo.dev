import type { APIRoute } from "astro";

import { getUsername } from "~/lib/github";
import {
  renderErrorCard,
  renderStatsCard,
  svgResponse,
} from "~/lib/github-card";
import { getStatsCardInput } from "~/server/readme-cards";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    return svgResponse(renderStatsCard(await getStatsCardInput(username)));
  } catch (error) {
    console.error(error);

    return svgResponse(renderErrorCard("GitHub stats"), 60);
  }
}) satisfies APIRoute;
