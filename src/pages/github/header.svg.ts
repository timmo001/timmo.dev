import type { APIRoute } from "astro";

import { profile } from "~/data/readme";
import { getUsername } from "~/lib/github";
import { headerCard, renderCard, svgResponse } from "~/lib/github-card";

export const prerender = false;

export const GET = (() =>
  svgResponse(
    renderCard(
      headerCard({
        name: profile.name,
        handle: profile.handle,
        username: getUsername(),
        role: profile.role,
      }),
    ),
    60 * 60 * 24,
  )) satisfies APIRoute;
