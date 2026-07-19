import type { APIRoute } from "astro";

import { getTopLanguages, getUsername } from "~/lib/github";
import {
  renderErrorCard,
  renderLanguagesCard,
  svgResponse,
} from "~/lib/github-card";
import { getUserData } from "~/server/github";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    const { user } = await getUserData(username);
    return svgResponse(renderLanguagesCard(username, getTopLanguages(user)));
  } catch {
    return svgResponse(renderErrorCard("Top Languages"), 60);
  }
}) satisfies APIRoute;
