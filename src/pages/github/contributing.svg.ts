import type { APIRoute } from "astro";

import { getUsername } from "~/lib/github";
import {
  renderActivityCard,
  renderErrorCard,
  svgResponse,
} from "~/lib/github-card";
import { ACTIVITY_WINDOW_LABEL, getSplitActivity } from "~/server/readme-cards";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    const { upstream } = await getSplitActivity(username);

    return svgResponse(
      renderActivityCard({
        title: "Contributing to",
        label: "Contributing to",
        meta: ACTIVITY_WINDOW_LABEL,
        items: upstream,
        emptyText:
          "No public contributions to other projects in the last 60 days.",
      }),
    );
  } catch (error) {
    console.error(error);

    return svgResponse(renderErrorCard("Contributing to"), 60);
  }
}) satisfies APIRoute;
