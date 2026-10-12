import type { APIRoute } from "astro";

import { profile } from "~/data/readme";
import { getUsername } from "~/lib/github";
import { headerCard, renderCard, svgResponse } from "~/lib/github-card";
import { getHeaderHighlight } from "~/server/readme-cards";

export const prerender = false;

export const GET = (async () => {
  const username = getUsername();

  return svgResponse(
    renderCard(
      headerCard({
        name: profile.name,
        handle: profile.handle,
        username,
        role: profile.role,
        highlight: await getHeaderHighlight(username),
      }),
    ),
  );
}) satisfies APIRoute;
