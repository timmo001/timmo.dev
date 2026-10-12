import type { APIRoute } from "astro";

import { getTopLanguages, getUsername } from "~/lib/github";
import {
  errorCard,
  languagesCard,
  renderCard,
  svgResponse,
} from "~/lib/github-card";
import { getUserData } from "~/server/github";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    const { user } = await getUserData(username);

    return svgResponse(
      renderCard(languagesCard({ languages: getTopLanguages(user) })),
    );
  } catch (error) {
    console.error(error);

    return svgResponse(renderCard(errorCard("Top languages")), 60);
  }
}) satisfies APIRoute;
