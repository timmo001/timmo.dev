import { STATS_CACHE_TTL_SECONDS } from "~/lib/stats-cache";
import type { ProfileStats } from "~/server/github";
import type { Language } from "~/types/github/language";

const FONT_FAMILY =
  "system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif";

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
  <style>text { font-family: ${FONT_FAMILY}; } .heading { fill: #f9fafb; font-size: 18px; font-weight: 600; } .label { fill: #9ca3af; font-size: 12px; } .value { fill: #f9fafb; font-size: 14px; font-weight: 600; }</style>`;
}

export function renderStatsCard(
  username: string,
  stats: ProfileStats,
  year: number,
): string {
  const items = [
    ["Total Stars", stats.totalStars],
    [`Total Commits (${year})`, stats.totalCommits],
    ["Total PRs", stats.totalPullRequests],
    ["Total Issues", stats.totalIssues],
  ] as const;
  const rows = items
    .map(([label, value], index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = 24 + column * 220;
      const y = 77 + row * 38;
      return `<text class="label" x="${x}" y="${y}">${escapeXml(label)}</text><text class="value" x="${x + 145}" y="${y}" text-anchor="end">${value.toLocaleString("en-GB")}</text>`;
    })
    .join("");

  return `${cardStart(470, 195, `${username}'s GitHub stats`, `GitHub activity statistics for ${username}`)}
  <text class="heading" x="24" y="36">${escapeXml(username)}&apos;s GitHub stats</text>
  <rect x="24" y="50" width="422" height="2" rx="1" fill="#818cf8"/>
  ${rows}
</svg>`;
}

export function renderLanguagesCard(
  username: string,
  languages: Array<Language>,
): string {
  const displayedLanguages = languages.slice(0, 5);
  const totalSize = displayedLanguages.reduce(
    (total, language) => total + language.size,
    0,
  );
  const rows = displayedLanguages
    .map((language, index) => {
      const percentage =
        totalSize === 0 ? 0 : (language.size / totalSize) * 100;
      const y = 72 + index * 24;
      return `<circle cx="24" cy="${y - 4}" r="5" fill="${escapeXml(language.color || "#9ca3af")}"/><text class="value" x="38" y="${y}">${escapeXml(language.name)}</text><text class="label" x="326" y="${y}" text-anchor="end">${percentage.toFixed(1)}%</text>`;
    })
    .join("");

  return `${cardStart(350, 195, `${username}'s top languages`, `Most-used public repository languages for ${username}`)}
  <text class="heading" x="24" y="36">Top Languages</text>
  <rect x="24" y="50" width="302" height="2" rx="1" fill="#818cf8"/>
  ${rows}
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
