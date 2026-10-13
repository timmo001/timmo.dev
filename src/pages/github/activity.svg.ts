import type { APIRoute } from "astro";

import { getUsername } from "~/lib/github";
import { errorCard, renderCard, svgResponse } from "~/lib/github-card";
import { getSplitActivity, workingOnCard } from "~/server/readme-cards";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    const { own } = await getSplitActivity(username);

    return svgResponse(renderCard(workingOnCard(own)));
  } catch (error) {
    console.error(error);

    return svgResponse(renderCard(errorCard("Working on")), 60);
  }
}) satisfies APIRoute;
