import type { APIRoute } from "astro";

import { getUsername } from "~/lib/github";
import {
  calendarCard,
  errorCard,
  renderCard,
  svgResponse,
} from "~/lib/github-card";
import { getContributionInsights } from "~/server/github-readme";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    const insights = await getContributionInsights(username);

    return svgResponse(
      renderCard(
        calendarCard({ days: insights.days, total: insights.lastYearTotal }),
      ),
    );
  } catch (error) {
    console.error(error);

    return svgResponse(renderCard(errorCard("Contributions")), 60);
  }
}) satisfies APIRoute;
