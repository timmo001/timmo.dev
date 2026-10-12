import type { APIRoute } from "astro";

import { getReadmeLink } from "~/data/readme";
import {
  notFoundResponse,
  renderLinkButton,
  svgResponse,
} from "~/lib/github-card";

export const prerender = false;

export const GET = (({ params }) => {
  const link = params.id ? getReadmeLink(params.id) : undefined;

  if (!link) {
    return notFoundResponse();
  }

  return svgResponse(
    renderLinkButton({ label: link.label, icon: link.icon }),
    60 * 60 * 24,
  );
}) satisfies APIRoute;
