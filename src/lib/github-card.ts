import { STATS_CACHE_TTL_SECONDS } from "~/lib/stats-cache";
import type { ProfileStats } from "~/server/github";
import type { Language } from "~/types/github/language";

const FONT_FAMILY =
  "system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif";
const CARD_WIDTH = 700;
const CARD_HEIGHT = 200;

const STAT_ICONS = {
  stars:
    '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  contributions:
    '<path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M15 6a9 9 0 0 0-9 9M18 15v6M21 18h-6"/>',
  pullRequests:
    '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>',
  issues: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>',
  repositories:
    '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
  followers:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
} as const;

type StatIcon = keyof typeof STAT_ICONS;
type StatItem = readonly [label: string, value: number, icon: StatIcon];

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
  <rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" fill="#030712" stroke="#1f2937"/>
  <rect x="0" y="30" width="3" height="48" fill="#818cf8"/>
  <style>
    text { font-family: ${FONT_FAMILY}; }
    .heading { fill: #f9fafb; font-size: 19px; font-weight: 650; letter-spacing: -.3px; }
    .subheading { fill: #f9fafb; font-size: 14px; font-weight: 600; }
    .label { fill: #9ca3af; font-size: 11px; }
    .value { fill: #f9fafb; font-size: 19px; font-weight: 650; letter-spacing: -.3px; }
    .icon { fill: none; stroke: #a5b4fc; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .language { fill: #f9fafb; font-size: 12px; font-weight: 600; }
    .percentage { fill: #d1d5db; font-size: 11px; font-weight: 500; }
  </style>`;
}

function renderStatGrid(
  items: ReadonlyArray<StatItem>,
  columns: number,
  startX: number,
  startY: number,
  columnWidth: number,
  rowHeight: number,
): string {
  return items
    .map(([label, value, icon], index) => {
      const x = startX + (index % columns) * columnWidth;
      const y = startY + Math.floor(index / columns) * rowHeight;
      return `<svg class="icon" x="${x}" y="${y + 7}" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">${STAT_ICONS[icon]}</svg>
      <text class="label" x="${x + 40}" y="${y + 12}">${escapeXml(label)}</text>
      <text class="value" x="${x + 40}" y="${y + 35}">${value.toLocaleString("en-GB")}</text>`;
    })
    .join("");
}

function renderLanguageItems(
  languages: Array<Language>,
  limit: number,
  columns: number,
  startX: number,
  startY: number,
  columnWidth: number,
  rowHeight: number,
  pillWidth: number,
): string {
  const displayedLanguages = languages.slice(0, limit);
  const totalSize = displayedLanguages.reduce(
    (total, language) => total + language.size,
    0,
  );
  const rows = Math.ceil(displayedLanguages.length / columns);

  return displayedLanguages
    .map((language, index) => {
      const column = Math.floor(index / rows);
      const row = index % rows;
      const x = startX + column * columnWidth + columnWidth / 2;
      const y = startY + row * rowHeight;
      const color = escapeXml(language.color || "#9ca3af");
      const percentage =
        totalSize === 0 ? 0 : (language.size / totalSize) * 100;
      return `<circle cx="${x - pillWidth / 2 + 5}" cy="${y + 12}" r="5" fill="${color}"/>
      <text class="language" x="${x - pillWidth / 2 + 16}" y="${y + 16}">${escapeXml(language.name)}</text>
      <text class="percentage" x="${x + pillWidth / 2}" y="${y + 16}" text-anchor="end">${percentage.toFixed(1)}%</text>`;
    })
    .join("");
}

export function renderLanguagesCard(
  username: string,
  languages: Array<Language>,
): string {
  return `${cardStart(CARD_WIDTH, CARD_HEIGHT, `${username}'s top languages`, `Most-used public repository languages for ${username}`)}
  <text class="heading" x="32" y="39">Top Languages</text>
  <rect x="32" y="50" width="180" height="2" fill="#818cf8"/>
  ${renderLanguageItems(languages, 9, 3, 32, 68, 212, 42, 158)}
</svg>`;
}

export function renderStatsCard(username: string, stats: ProfileStats): string {
  const items = [
    ["Commits", stats.totalCommits, "contributions"],
    ["Pull requests", stats.totalPullRequests, "pullRequests"],
    ["Issues", stats.totalIssues, "issues"],
    ["Repositories", stats.publicRepositories, "repositories"],
    ["Stars", stats.totalStars, "stars"],
    ["Followers", stats.followers, "followers"],
  ] as const satisfies ReadonlyArray<StatItem>;

  return `${cardStart(700, 250, `${username}'s GitHub stats`, `GitHub activity statistics for ${username}`)}
  <text class="heading" x="32" y="39">Timmo&apos;s stats</text>
  <rect x="32" y="50" width="180" height="2" fill="#818cf8"/>
  ${renderStatGrid(items, 3, 64, 78, 212, 76)}
</svg>`;
}

export function renderReadmeCard(
  username: string,
  stats: ProfileStats,
  languages: Array<Language>,
): string {
  const items = [
    ["Commits", stats.totalCommits, "contributions"],
    ["Pull requests", stats.totalPullRequests, "pullRequests"],
    ["Issues", stats.totalIssues, "issues"],
    ["Repositories", stats.publicRepositories, "repositories"],
    ["Stars", stats.totalStars, "stars"],
    ["Followers", stats.followers, "followers"],
  ] as const satisfies ReadonlyArray<StatItem>;

  return `${cardStart(700, 380, `${username}'s GitHub stats`, `GitHub activity statistics and top languages for ${username}`)}
  <text class="heading" x="32" y="39">Timmo&apos;s stats</text>
  <rect x="32" y="50" width="180" height="2" fill="#818cf8"/>
  ${renderStatGrid(items, 3, 64, 84, 212, 76)}
  <text class="subheading" x="32" y="252">Top Languages</text>
  ${renderLanguageItems(languages, 9, 3, 32, 272, 212, 30, 158)}
</svg>`;
}

export function renderErrorCard(title: string): string {
  return `${cardStart(470, 100, title, "GitHub statistics are temporarily unavailable")}
  <text class="heading" x="32" y="39">${escapeXml(title)}</text>
  <text class="label" x="32" y="68">Statistics are temporarily unavailable.</text>
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
