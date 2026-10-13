import type { APIRoute } from "astro";

import { getUsername } from "~/lib/github";
import { renderCardStack, svgResponse } from "~/lib/github-card";
import { getReadmeCardSet } from "~/server/readme-cards";

export const prerender = false;

/** Every profile card in one image, for the GitHub profile README. */
export const GET = (async () => {
  const username = getUsername();

  const { cards, degraded } = await getReadmeCardSet(username);

  return svgResponse(
    renderCardStack(
      cards,
      `${username}'s GitHub profile`,
      `GitHub profile cards for ${username}: stats, contributions, activity, releases, and languages.`,
    ),
    degraded ? 60 : undefined,
  );
}) satisfies APIRoute;
