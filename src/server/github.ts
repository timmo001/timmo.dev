import { Octokit } from "octokit";

import { env } from "~/env";
import { type User } from "~/types/github/user";

const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

const CACHE_TTL_MS = 60 * 60 * 1000;

type CacheEntry = {
  value: User;
  expiresAt: number;
};

const userCache = new Map<string, CacheEntry>();

export async function getUserData(user: string): Promise<User> {
  const cached = userCache.get(user);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
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

    userCache.set(user, {
      value: result,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
