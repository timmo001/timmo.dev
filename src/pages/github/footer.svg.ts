import type { APIRoute } from "astro";

import { SOURCE_REPOSITORY } from "~/data/readme";
import { renderFooterCard, svgResponse } from "~/lib/github-card";

export const prerender = false;

export const GET = (() =>
  svgResponse(
    renderFooterCard({ updatedAt: new Date(), source: SOURCE_REPOSITORY }),
  )) satisfies APIRoute;
