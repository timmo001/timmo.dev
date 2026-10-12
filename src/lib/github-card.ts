import { renderLanguageSection } from "~/lib/cards/languages";
import {
  renderStatGrid,
  type StatsCardInput,
  statsCells,
} from "~/lib/cards/stats";
import {
  CARD_WIDTH,
  escapeXml,
  PADDING,
  sectionLabel,
  tile,
} from "~/lib/cards/theme";
import { STATS_CACHE_TTL_SECONDS } from "~/lib/stats-cache";
import type { Language } from "~/types/github/language";

export {
  renderActivityCard,
  type ActivityCardInput,
} from "~/lib/cards/activity";

export {
  renderCalendarCard,
  type CalendarCardInput,
} from "~/lib/cards/calendar";

export { renderFooterCard } from "~/lib/cards/footer";

export { renderHeaderCard, type HeaderCardInput } from "~/lib/cards/header";

export { renderLanguagesCard } from "~/lib/cards/languages";

export {
  LINK_BUTTON_WIDTH,
  renderLinkButton,
  type LinkButtonInput,
} from "~/lib/cards/links";

export {
  PROJECT_CARD_HEIGHT,
  renderProjectCard,
  type ProjectCardInput,
} from "~/lib/cards/projects";

export { renderReleasesCard, type ReleaseCardItem } from "~/lib/cards/releases";

export { renderStatsCard, type StatsCardInput } from "~/lib/cards/stats";

/** Stats and top languages in one image, for the original readme.svg URL. */
export function renderReadmeCard(
  input: StatsCardInput,
  languages: Array<Language>,
): string {
  const cells = statsCells(input);

  const languageLimit = 9;

  const languageRows = Math.ceil(Math.min(languages.length, languageLimit) / 3);

  const languagesTop = 58 + 2 * 78 + 24;

  const height = languagesTop + 30 + 10 + 26 + languageRows * 24 + 16;

  return tile({
    width: CARD_WIDTH,
    height,
    title: `${input.username}'s GitHub stats and top languages`,
    description: cells.map((cell) => `${cell.label}: ${cell.value}`).join(". "),
    body: (box) => {
      const section = renderLanguageSection(
        languages,
        box.x + PADDING,
        box.y + languagesTop + 30,
        box.width - PADDING * 2,
        languageLimit,
      );

      return `${sectionLabel(box, "GitHub stats")}
${renderStatGrid(cells, box.x + PADDING + 4, box.y + 58, (box.width - PADDING * 2) / 4)}
${sectionLabel(box, "Top languages", undefined, box.y + languagesTop + 8)}
${section.svg}`;
    },
  });
}

export function renderErrorCard(title: string): string {
  return tile({
    width: CARD_WIDTH,
    height: 96,
    title,
    description: "GitHub data is temporarily unavailable",
    body: (box) => `${sectionLabel(box, title)}
<text class="body" x="${box.x + PADDING}" y="${box.y + 64}">${escapeXml("Data is temporarily unavailable. Try again in a minute.")}</text>`,
  });
}

export function notFoundResponse(): Response {
  return new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": "public, s-maxage=60" },
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
          ? `public, s-maxage=${STATS_CACHE_TTL_SECONDS}, stale-while-revalidate=${STATS_CACHE_TTL_SECONDS * 24}`
          : `public, s-maxage=${cacheTtlSeconds}`,
      "Content-Type": "image/svg+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
