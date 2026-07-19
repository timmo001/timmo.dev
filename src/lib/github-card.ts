import { STATS_CACHE_TTL_SECONDS } from "~/lib/stats-cache";
import type { ProfileStats } from "~/server/github";
import type { Language } from "~/types/github/language";

const FONT_FAMILY =
  "system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif";
const CARD_WIDTH = 440;
const CARD_HEIGHT = 200;
const CARD_PADDING = 24;
const CARD_CONTENT_WIDTH = CARD_WIDTH - CARD_PADDING * 2;

function escapeXml(value: string): string {
  return value.replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character] ?? character,
  );
}

function cardStart(
  width: number,
  height: number,
  title: string,
  description: string,
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title)}</title>
  <desc id="description">${escapeXml(description)}</desc>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="12" fill="#030712" stroke="#1f2937"/>
  <style>text { font-family: ${FONT_FAMILY}; } .heading { fill: #f9fafb; font-size: 18px; font-weight: 600; } .subheading { fill: #f9fafb; font-size: 14px; font-weight: 600; } .label { fill: #9ca3af; font-size: 12px; } .value { fill: #f9fafb; font-size: 16px; font-weight: 600; }</style>`;
}

function renderStatItems(
  stats: ProfileStats,
  year: number,
  yOffset = 0,
): string {
  const items = [
    ["Stars", stats.totalStars],
    [`Commits in ${year}`, stats.totalCommits],
    ["Pull requests", stats.totalPullRequests],
    ["Issues", stats.totalIssues],
  ] as const;
  return items
    .map(([label, value], index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = CARD_PADDING + column * (CARD_CONTENT_WIDTH / 2 + 8);
      const y = 82 + row * 58 + yOffset;
      return `<text class="label" x="${x}" y="${y}">${escapeXml(label)}</text><text class="value" x="${x}" y="${y + 24}">${value.toLocaleString("en-GB")}</text>`;
    })
    .join("");
}

function renderLanguageItems(
  languages: Array<Language>,
  firstRowY = 72,
): string {
  const displayedLanguages = languages.slice(0, 5);
  const totalSize = displayedLanguages.reduce(
    (total, language) => total + language.size,
    0,
  );
  return displayedLanguages
    .map((language, index) => {
      const percentage =
        totalSize === 0 ? 0 : (language.size / totalSize) * 100;
      const y = firstRowY + index * 24;
      return `<circle cx="32" cy="${y - 4}" r="5" fill="${escapeXml(language.color || "#9ca3af")}"/><text class="value" x="48" y="${y}">${escapeXml(language.name)}</text><text class="label" x="408" y="${y}" text-anchor="end">${percentage.toFixed(1)}%</text>`;
    })
    .join("");
}

export function renderStatsCard(
  username: string,
  stats: ProfileStats,
  year: number,
): string {
  return `${cardStart(CARD_WIDTH, CARD_HEIGHT, `${username}'s GitHub stats`, `GitHub activity statistics for ${username}`)}
  <text class="heading" x="24" y="36">${escapeXml(username)}&apos;s GitHub stats</text>
  <rect x="${CARD_PADDING}" y="50" width="${CARD_CONTENT_WIDTH}" height="2" rx="1" fill="#818cf8"/>
  ${renderStatItems(stats, year)}
</svg>`;
}

export function renderLanguagesCard(
  username: string,
  languages: Array<Language>,
): string {
  return `${cardStart(CARD_WIDTH, CARD_HEIGHT, `${username}'s top languages`, `Most-used public repository languages for ${username}`)}
  <text class="heading" x="24" y="36">Top Languages</text>
  <rect x="${CARD_PADDING}" y="50" width="${CARD_CONTENT_WIDTH}" height="2" rx="1" fill="#818cf8"/>
  ${renderLanguageItems(languages)}
</svg>`;
}

export function renderReadmeCard(
  username: string,
  stats: ProfileStats,
  languages: Array<Language>,
  year: number,
): string {
  return `${cardStart(CARD_WIDTH, 365, `${username}'s GitHub stats`, `GitHub activity statistics and top languages for ${username}`)}
  <text class="heading" x="24" y="36">${escapeXml(username)}&apos;s GitHub stats</text>
  <rect x="${CARD_PADDING}" y="50" width="${CARD_CONTENT_WIDTH}" height="2" rx="1" fill="#818cf8"/>
  ${renderStatItems(stats, year)}
  <text class="subheading" x="24" y="205">Top Languages</text>
  <rect x="${CARD_PADDING}" y="218" width="${CARD_CONTENT_WIDTH}" height="1" rx="0.5" fill="#374151"/>
  ${renderLanguageItems(languages, 246)}
</svg>`;
}

export function renderErrorCard(title: string): string {
  return `${cardStart(470, 100, title, "GitHub statistics are temporarily unavailable")}
  <text class="heading" x="24" y="40">${escapeXml(title)}</text>
  <text class="label" x="24" y="68">Statistics are temporarily unavailable.</text>
</svg>`;
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
