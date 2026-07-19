import type { APIRoute } from "astro";

import { getTopLanguages, getUsername } from "~/lib/github";
import {
  renderErrorCard,
  renderReadmeCard,
  svgResponse,
} from "~/lib/github-card";
import { getProfileStats, getUserData } from "~/server/github";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  try {
    const stats = await getProfileStats(username);
    const { user } = await getUserData(username);
    return svgResponse(
      renderReadmeCard(
        username,
        stats,
        getTopLanguages(user),
        new Date().getUTCFullYear(),
      ),
    );
  } catch {
    return svgResponse(renderErrorCard("GitHub stats"), 60);
  }
}) satisfies APIRoute;
