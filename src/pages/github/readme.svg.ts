import type { APIRoute } from "astro";

import { getTopLanguages, getUsername } from "~/lib/github";
import {
  renderErrorCard,
  renderReadmeCard,
  svgResponse,
} from "~/lib/github-card";
import { getUserData } from "~/server/github";
import { getStatsCardInput } from "~/server/readme-cards";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    const [stats, { user }] = await Promise.all([
      getStatsCardInput(username),
      getUserData(username),
    ]);

    return svgResponse(renderReadmeCard(stats, getTopLanguages(user)));
  } catch (error) {
    console.error(error);

    return svgResponse(renderErrorCard("GitHub stats"), 60);
  }
}) satisfies APIRoute;
