// Assembles the inputs for the GitHub profile README cards from the GitHub
// fetchers, so each /github/*.svg route stays a thin wrapper.
import { type ActivityCardItem } from "~/lib/cards/activity";
import { type StatsCardInput } from "~/lib/cards/stats";
import { formatNumber } from "~/lib/cards/theme";
import { getCurrentActivity, getProfileStats } from "~/server/github";
import { getContributionInsights } from "~/server/github-readme";

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
