import type { APIRoute } from "astro";

import { getUsername } from "~/lib/github";
import { errorCard, renderCard, svgResponse } from "~/lib/github-card";
import { contributingCard, getSplitActivity } from "~/server/readme-cards";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    const { upstream } = await getSplitActivity(username);

    return svgResponse(renderCard(contributingCard(upstream)));
  } catch (error) {
    console.error(error);

    return svgResponse(renderCard(errorCard("Contributing to")), 60);
  }
}) satisfies APIRoute;
