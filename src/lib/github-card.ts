import {
  CARD_WIDTH,
  type CardSpec,
  card,
  escapeXml,
  PADDING,
  sectionLabel,
} from "~/lib/cards/theme";
import { STATS_CACHE_TTL_SECONDS } from "~/lib/stats-cache";

export { activityCard, type ActivityCardInput } from "~/lib/cards/activity";

export { calendarCard, type CalendarCardInput } from "~/lib/cards/calendar";

export { footerCard } from "~/lib/cards/footer";

export { headerCard, type HeaderCardInput } from "~/lib/cards/header";

export { languagesCard } from "~/lib/cards/languages";

export { releasesCard, type ReleaseCardItem } from "~/lib/cards/releases";

export { statsCard, type StatsCardInput } from "~/lib/cards/stats";

export { type CardSpec, renderCard, renderCardStack } from "~/lib/cards/theme";

export function errorCard(title: string): CardSpec {
  return card({
    width: CARD_WIDTH,
    height: 96,
    title,
    description: `${title}: GitHub data is temporarily unavailable`,
    body: (box) => `${sectionLabel(box, title)}
<text class="body" x="${box.x + PADDING}" y="${box.y + 64}">${escapeXml("Data is temporarily unavailable. Try again in a minute.")}</text>`,
  });
}

export function svgResponse(
  svg: string,
  cacheTtlSeconds = STATS_CACHE_TTL_SECONDS,
): Response {
  return new Response(svg, {
    headers: {
      "Cache-Control":
        cacheTtlSeconds === STATS_CACHE_TTL_SECONDS
          ? `public, max-age=${STATS_CACHE_TTL_SECONDS}, s-maxage=${STATS_CACHE_TTL_SECONDS}, stale-while-revalidate=${STATS_CACHE_TTL_SECONDS * 24}`
          : `public, max-age=${cacheTtlSeconds}, s-maxage=${cacheTtlSeconds}`,
      "Content-Type": "image/svg+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
