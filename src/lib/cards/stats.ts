import { format } from "date-fns";

import {
  CARD_WIDTH,
  escapeXml,
  formatNumber,
  icon,
  type IconName,
  PADDING,
  plural,
  sectionLabel,
  tile,
} from "~/lib/cards/theme";

export type StatsCardInput = {
  username: string;
  year: number;
  contributionsThisYear: number;
  contributionsAllTime: number;
  memberSince: number;
  totalCommits: number;
  totalPullRequests: number;
  mergedPullRequests: number;
  totalIssues: number;
  totalStars: number;
  publicRepositories: number;
  followers: number;
  currentStreak: number;
  longestStreak: number;
  updatedAt: Date;
};

type StatCell = {
  label: string;
  value: string;
  sub?: string;
  icon: IconName;
};

const COLUMNS = 4;

const ROW_HEIGHT = 78;

const HEIGHT = 240;

export function statsCells(input: StatsCardInput): Array<StatCell> {
  return [
    {
      label: `Contributions ${input.year}`,
      value: formatNumber(input.contributionsThisYear),
      sub: `${formatNumber(input.contributionsAllTime)} since ${input.memberSince}`,
      icon: "contributions",
    },
    {
      label: "Pull requests",
      value: formatNumber(input.totalPullRequests),
      sub: `${formatNumber(input.mergedPullRequests)} merged`,
      icon: "pullRequests",
    },
    {
      label: "Commits",
      value: formatNumber(input.totalCommits),
      sub: "authored on GitHub",
      icon: "commits",
    },
    {
      label: "Issues",
      value: formatNumber(input.totalIssues),
      sub: "opened",
      icon: "issues",
    },
    {
      label: "Stars",
      value: formatNumber(input.totalStars),
      sub: "across public repos",
      icon: "stars",
    },
    {
      label: "Repositories",
      value: formatNumber(input.publicRepositories),
      sub: "public",
      icon: "repositories",
    },
    {
      label: "Followers",
      value: formatNumber(input.followers),
      icon: "followers",
    },
    {
      label: "Current streak",
      value: plural(input.currentStreak, "day"),
      sub: `longest ${plural(input.longestStreak, "day")}`,
      icon: "streak",
    },
  ];
}

export function renderStatGrid(
  cells: Array<StatCell>,
  startX: number,
  startY: number,
  columnWidth: number,
): string {
  return cells
    .map((cell, index) => {
      const x = startX + (index % COLUMNS) * columnWidth;

      const y = startY + Math.floor(index / COLUMNS) * ROW_HEIGHT;

      return `<g>
${icon(cell.icon, x, y + 6, 22)}
<text class="label" x="${x + 34}" y="${y + 14}" style="letter-spacing:.6px">${escapeXml(cell.label.toUpperCase())}</text>
<text class="value" x="${x + 34}" y="${y + 42}">${escapeXml(cell.value)}</text>
${cell.sub ? `<text class="sub" x="${x + 34}" y="${y + 60}">${escapeXml(cell.sub)}</text>` : ""}
</g>`;
    })
    .join("\n");
}

export function renderStatsCard(input: StatsCardInput): string {
  const cells = statsCells(input);

  return tile({
    width: CARD_WIDTH,
    height: HEIGHT,
    title: `${input.username}'s GitHub stats`,
    description: cells.map((cell) => `${cell.label}: ${cell.value}`).join(". "),
    body: (box) => {
      const columnWidth = (box.width - PADDING * 2) / COLUMNS;

      return `${sectionLabel(box, "GitHub stats", `Updated ${format(input.updatedAt, "d MMM yyyy")}`)}
${renderStatGrid(cells, box.x + PADDING + 4, box.y + 58, columnWidth)}`;
    },
  });
}
