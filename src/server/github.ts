import { Octokit } from "octokit";

import { addCacheExpiry, isCacheValid } from "~/lib/dates";
import { env } from "~/env";
import { STATS_CACHE_TTL_MS } from "~/lib/stats-cache";
import { type User, type UserNode } from "~/types/github/user";

const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

type CacheEntry = {
  value: User;
  expiresAt: number;
  fetchedAt: number;
};

type UserDataResult = {
  user: UserNode;
  fetchedAt: Date;
};

const userCache = new Map<string, CacheEntry>();

export async function getUserData(user: string): Promise<UserDataResult> {
  const cached = userCache.get(user);
  if (cached && isCacheValid(cached.expiresAt)) {
    return {
      user: cached.value.user,
      fetchedAt: new Date(cached.fetchedAt),
    };
  }
  const query = `query ($login: String!) {
  user(login: $login) {
    id
    name
    avatarUrl
    bio
    email
    login
    contributionsCollection {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
    }
    followers {
      totalCount
    }
    following {
      totalCount
    }
    repositories(
      first: 100
      isFork: false
      orderBy: { field: UPDATED_AT, direction: DESC }
    ) {
      totalCount
      totalDiskUsage
      nodes {
        name
        languages(first: 100, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
    starredRepositories {
      totalCount
    }
    socialAccounts(first: 100) {
      nodes {
        displayName
        provider
        url
      }
    }
    status {
      message
      emoji
      emojiHTML
    }
    watching {
      totalCount
    }
  }
}`;

  try {
    const result = await octokit.graphql<User>(query, {
      login: user,
    });

    const fetchedAt = Date.now();

    const expiresAt = addCacheExpiry(fetchedAt, STATS_CACHE_TTL_MS);

    userCache.set(user, {
      value: result,
      expiresAt,
      fetchedAt,
    });

    return {
      user: result.user,
      fetchedAt: new Date(fetchedAt),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
