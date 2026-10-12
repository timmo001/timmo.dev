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
    const { own } = await getSplitActivity(username);

    return svgResponse(
      renderActivityCard({
        title: "Working on",
        label: "Working on",
        meta: ACTIVITY_WINDOW_LABEL,
        items: own,
        emptyText: "Nothing public in the last 60 days.",
      }),
    );
  } catch (error) {
    console.error(error);

    return svgResponse(renderErrorCard("Working on"), 60);
  }
}) satisfies APIRoute;
