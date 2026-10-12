// Assembles the inputs for the GitHub profile README cards from the GitHub
// fetchers, so each /github/*.svg route stays a thin wrapper, and builds the
// full card set for the combined readme.svg.
import { profile, SOURCE_REPOSITORY } from "~/data/readme";
import { type ActivityCardItem } from "~/lib/cards/activity";
import { type StatsCardInput } from "~/lib/cards/stats";
import { formatNumber } from "~/lib/cards/theme";
import { getTopLanguages } from "~/lib/github";
import {
  activityCard,
  calendarCard,
  type CardSpec,
  errorCard,
  footerCard,
  headerCard,
  languagesCard,
  releasesCard,
  statsCard,
} from "~/lib/github-card";
import {
  getCurrentActivity,
  getProfileStats,
  getUserData,
} from "~/server/github";
import {
  getContributionInsights,
  getLatestReleases,
} from "~/server/github-readme";

export const ACTIVITY_WINDOW_LABEL = "Last 60 days";

export async function getStatsCardInput(
  username: string,
): Promise<StatsCardInput> {
  const [stats, insights] = await Promise.all([
    getProfileStats(username),
    getContributionInsights(username),
  ]);

  return {
    username,
    year: insights.year,
    contributionsThisYear: insights.thisYearTotal,
    contributionsAllTime: insights.allTimeTotal,
    memberSince: insights.memberSince,
    totalCommits: stats.totalCommits,
    totalPullRequests: stats.totalPullRequests,
    mergedPullRequests: insights.mergedPullRequests,
    totalIssues: stats.totalIssues,
    totalStars: stats.totalStars,
    publicRepositories: stats.publicRepositories,
    followers: stats.followers,
    currentStreak: insights.currentStreak,
    longestStreak: insights.longestStreak,
    updatedAt: insights.fetchedAt,
  };
}

export type SplitActivity = {
  own: Array<ActivityCardItem>;
  upstream: Array<ActivityCardItem>;
};

function isOwnRepository(nameWithOwner: string, username: string): boolean {
  return nameWithOwner.toLowerCase().startsWith(`${username.toLowerCase()}/`);
}

export async function getSplitActivity(
  username: string,
): Promise<SplitActivity> {
  const activity = await getCurrentActivity(username);

  const byScore = activity.items.toSorted(
    (left, right) =>
      right.score - left.score ||
      right.latestActivityAt.getTime() - left.latestActivityAt.getTime(),
  );

  const toItem = (item: (typeof byScore)[number]): ActivityCardItem => ({
    nameWithOwner: item.nameWithOwner,
    description: item.description,
    commits: item.commits,
    pullRequests: item.pullRequests,
    reviews: item.reviews,
  });

  return {
    own: byScore
      .filter((item) => isOwnRepository(item.nameWithOwner, username))
      .map(toItem),
    upstream: byScore
      .filter((item) => !isOwnRepository(item.nameWithOwner, username))
      .map(toItem),
  };
}

/** A one-line status for the header pill, from the busiest upstream repo. */
export async function getHeaderHighlight(
  username: string,
): Promise<string | undefined> {
  try {
    const { upstream } = await getSplitActivity(username);

    const [top] = upstream;

    if (!top) {
      return undefined;
    }

    const parts = [
      top.pullRequests > 0 ? `${formatNumber(top.pullRequests)} PRs` : null,
      top.reviews > 0 ? `${formatNumber(top.reviews)} reviews` : null,
      top.commits > 0 && top.pullRequests === 0
        ? `${formatNumber(top.commits)} commits`
        : null,
    ].filter((part) => part !== null);

    return `Active in ${top.nameWithOwner}${parts.length ? ` · ${parts.join(", ")} in 60 days` : ""}`;
  } catch (error) {
    console.error(error);

    return undefined;
  }
}

export function contributingCard(items: Array<ActivityCardItem>): CardSpec {
  return activityCard({
    title: "Contributing to",
    label: "Contributing to",
    meta: ACTIVITY_WINDOW_LABEL,
    items,
    emptyText: "No public contributions to other projects in the last 60 days.",
  });
}

export function workingOnCard(items: Array<ActivityCardItem>): CardSpec {
  return activityCard({
    title: "Working on",
    label: "Working on",
    meta: ACTIVITY_WINDOW_LABEL,
    items,
    emptyText: "Nothing public in the last 60 days.",
  });
}

export type ReadmeCardSet = {
  cards: Array<CardSpec>;
  /** True when at least one section fell back to an error card. */
  degraded: boolean;
};

async function section(
  title: string,
  load: () => Promise<Array<CardSpec>>,
): Promise<{ cards: Array<CardSpec>; failed: boolean }> {
  try {
    return { cards: await load(), failed: false };
  } catch (error) {
    console.error(error);

    return { cards: [errorCard(title)], failed: true };
  }
}

/** Every README card in display order, with error cards for failed sections. */
export async function getReadmeCardSet(
  username: string,
): Promise<ReadmeCardSet> {
  const sections = await Promise.all([
    section("Profile", async () => [
      headerCard({
        name: profile.name,
        handle: profile.handle,
        username,
        role: profile.role,
        highlight: await getHeaderHighlight(username),
      }),
    ]),
    section("GitHub stats", async () => [
      statsCard(await getStatsCardInput(username)),
    ]),
    section("Contributions", async () => {
      const insights = await getContributionInsights(username);

      return [
        calendarCard({ days: insights.days, total: insights.lastYearTotal }),
      ];
    }),
    section("Activity", async () => {
      const { upstream, own } = await getSplitActivity(username);

      return [contributingCard(upstream), workingOnCard(own)];
    }),
    section("Latest releases", async () => [
      releasesCard({ items: await getLatestReleases(username) }),
    ]),
    section("Top languages", async () => {
      const { user } = await getUserData(username);

      return [languagesCard({ languages: getTopLanguages(user) })];
    }),
  ]);

  return {
    cards: [
      ...sections.flatMap((result) => result.cards),
      footerCard({ updatedAt: new Date(), source: SOURCE_REPOSITORY }),
    ],
    degraded: sections.some((result) => result.failed),
  };
}
