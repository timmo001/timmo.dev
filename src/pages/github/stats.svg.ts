import type { APIRoute } from "astro";

import { getUsername } from "~/lib/github";
import {
  errorCard,
  renderCard,
  statsCard,
  svgResponse,
} from "~/lib/github-card";
import { getStatsCardInput } from "~/server/readme-cards";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    return svgResponse(
      renderCard(statsCard(await getStatsCardInput(username))),
    );
  } catch (error) {
    console.error(error);

    return svgResponse(renderCard(errorCard("GitHub stats")), 60);
  }
}) satisfies APIRoute;
