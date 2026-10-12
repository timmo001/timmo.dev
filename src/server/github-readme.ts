// Data for the GitHub profile README cards that the existing stats and
// activity fetchers do not already cover: the contribution calendar and
// streaks, merged pull requests, latest releases, and stars for the featured
// projects. Each fetcher keeps its last good value when GitHub fails.
import { addCacheExpiry, isCacheValid } from "~/lib/dates";
import { STATS_CACHE_TTL_MS } from "~/lib/stats-cache";
import { queryGitHub } from "~/server/github";

export type ContributionDay = {
  date: string;
  count: number;
};

export type ContributionInsights = {
  /** One entry per day for the last 53 weeks, oldest first, from a Sunday. */
  days: Array<ContributionDay>;
  lastYearTotal: number;
  thisYearTotal: number;
  allTimeTotal: number;
  year: number;
  memberSince: number;
  mergedPullRequests: number;
  currentStreak: number;
  longestStreak: number;
  fetchedAt: Date;
};

export type LatestRelease = {
  repository: string;
  url: string;
  name: string;
  tagName: string;
  publishedAt: Date;
  isPrerelease: boolean;
};

export type RepositorySummary = {
  name: string;
  stargazerCount: number;
  primaryLanguage: { name: string; color: string | null } | null;
};

type InsightsData = {
  user: {
    createdAt: string;
    mergedPullRequests: { totalCount: number };
    contributionsCollection: {
      contributionYears: Array<number>;
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{ date: string; contributionCount: number }>;
        }>;
      };
    };
    thisYear: {
      contributionCalendar: { totalContributions: number };
    };
  };
};

type YearTotalsData = {
  user: Record<
    string,
    { contributionCalendar: { totalContributions: number } }
  >;
};

type ReleasesData = {
  user: {
    repositories: {
      nodes: Array<{
        name: string;
        url: string;
        latestRelease: {
          name: string | null;
          tagName: string;
          publishedAt: string | null;
          url: string;
          isPrerelease: boolean;
        } | null;
      }>;
    };
  };
};

type RepositorySummaryData = Record<
  string,
  {
    name: string;
    stargazerCount: number;
    primaryLanguage: { name: string; color: string | null } | null;
  } | null
>;

type Cached<T> = { value: T; expiresAt: number };

const insightsCache = new Map<string, Cached<ContributionInsights>>();

const releasesCache = new Map<string, Cached<Array<LatestRelease>>>();

const summaryCache = new Map<string, Cached<Array<RepositorySummary>>>();

async function withCache<T>(
  cache: Map<string, Cached<T>>,
  key: string,
  load: () => Promise<T>,
): Promise<T> {
  const cached = cache.get(key);

  if (cached && isCacheValid(cached.expiresAt)) {
    return cached.value;
  }

  try {
    const value = await load();

    cache.set(key, {
      value,
      expiresAt: addCacheExpiry(Date.now(), STATS_CACHE_TTL_MS),
    });

    return value;
  } catch (error) {
    if (cached) {
      console.error(error);

      return cached.value;
    }

    throw error;
  }
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export type Streaks = {
  current: number;
  longest: number;
};

export function calculateStreaks(
  days: Array<ContributionDay>,
  today: Date,
): Streaks {
  const counts = new Map(days.map((day) => [day.date, day.count]));

  const todayKey = isoDate(today);

  let longest = 0;

  let run = 0;

  for (const day of days) {
    if (day.date > todayKey) {
      break;
    }

    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  let current = 0;

  const cursor = new Date(today);

  // Today may have no contributions yet, so a streak can end yesterday.
  if (!counts.get(isoDate(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  while ((counts.get(isoDate(cursor)) ?? 0) > 0) {
    current += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return { current, longest };
}

export async function getContributionInsights(
  user: string,
): Promise<ContributionInsights> {
  return withCache(insightsCache, user, async () => {
    const now = new Date();

    const year = now.getUTCFullYear();

    const query = `query ($login: String!, $yearStart: DateTime!) {
  user(login: $login) {
    createdAt
    mergedPullRequests: pullRequests(states: MERGED) {
      totalCount
    }
    contributionsCollection {
      contributionYears
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
    thisYear: contributionsCollection(from: $yearStart) {
      contributionCalendar {
        totalContributions
      }
    }
  }
}`;

    const { user: data } = await queryGitHub<InsightsData>(query, {
      login: user,
      yearStart: `${year}-01-01T00:00:00Z`,
    });

    const days =
      data.contributionsCollection.contributionCalendar.weeks.flatMap((week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
        })),
      );

    const previousYears = data.contributionsCollection.contributionYears.filter(
      (contributionYear) => contributionYear < year,
    );

    let allTimeTotal = data.thisYear.contributionCalendar.totalContributions;

    if (previousYears.length > 0) {
      const totalsQuery = `query ($login: String!) {
  user(login: $login) {
${previousYears
  .map(
    (contributionYear) =>
      `    y${contributionYear}: contributionsCollection(from: "${contributionYear}-01-01T00:00:00Z", to: "${contributionYear}-12-31T23:59:59Z") {
      contributionCalendar {
        totalContributions
      }
    }`,
  )
  .join("\n")}
  }
}`;

      const totals = await queryGitHub<YearTotalsData>(totalsQuery, {
        login: user,
      });

      for (const entry of Object.values(totals.user)) {
        allTimeTotal += entry.contributionCalendar.totalContributions;
      }
    }

    const { current, longest } = calculateStreaks(days, now);

    return {
      days,
      lastYearTotal:
        data.contributionsCollection.contributionCalendar.totalContributions,
      thisYearTotal: data.thisYear.contributionCalendar.totalContributions,
      allTimeTotal,
      year,
      memberSince: new Date(data.createdAt).getUTCFullYear(),
      mergedPullRequests: data.mergedPullRequests.totalCount,
      currentStreak: current,
      longestStreak: longest,
      fetchedAt: now,
    };
  });
}

export async function getLatestReleases(
  user: string,
): Promise<Array<LatestRelease>> {
  return withCache(releasesCache, user, async () => {
    const query = `query ($login: String!) {
  user(login: $login) {
    repositories(
      first: 100
      ownerAffiliations: OWNER
      privacy: PUBLIC
      isFork: false
      isArchived: false
      orderBy: { field: PUSHED_AT, direction: DESC }
    ) {
      nodes {
        name
        url
        latestRelease {
          name
          tagName
          publishedAt
          url
          isPrerelease
        }
      }
    }
  }
}`;

    const { user: data } = await queryGitHub<ReleasesData>(query, {
      login: user,
    });

    return data.repositories.nodes
      .flatMap((repository) => {
        const release = repository.latestRelease;

        if (!release?.publishedAt) {
          return [];
        }

        return [
          {
            repository: repository.name,
            url: release.url,
            name: release.name?.trim() || release.tagName,
            tagName: release.tagName,
            publishedAt: new Date(release.publishedAt),
            isPrerelease: release.isPrerelease,
          },
        ];
      })
      .toSorted(
        (left, right) =>
          right.publishedAt.getTime() - left.publishedAt.getTime(),
      );
  });
}

export async function getRepositorySummaries(
  user: string,
  names: Array<string>,
): Promise<Array<RepositorySummary>> {
  const unique = [...new Set(names)].filter((name) =>
    /^[A-Za-z0-9_.-]+$/.test(name),
  );

  if (unique.length === 0) {
    return [];
  }

  return withCache(summaryCache, `${user}:${unique.join(",")}`, async () => {
    const query = `query ($login: String!) {
${unique
  .map(
    (name, index) =>
      `  r${index}: repository(owner: $login, name: "${name}") {
    name
    stargazerCount
    primaryLanguage {
      name
      color
    }
  }`,
  )
  .join("\n")}
}`;

    const data = await queryGitHub<RepositorySummaryData>(query, {
      login: user,
    });

    return Object.values(data).flatMap((repository) =>
      repository
        ? [
            {
              name: repository.name,
              stargazerCount: repository.stargazerCount,
              primaryLanguage: repository.primaryLanguage,
            },
          ]
        : [],
    );
  });
}
