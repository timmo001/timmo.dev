import { Octokit } from "octokit";

import { addCacheExpiry, isCacheValid } from "~/lib/dates";
import { getEnv } from "~/env";
import { STATS_CACHE_TTL_MS } from "~/lib/stats-cache";
import { type User, type UserNode } from "~/types/github/user";

function getOctokit(): Octokit {
  const env = getEnv();
  if (!env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  return new Octokit({ auth: env.GITHUB_TOKEN });
}

type CacheEntry = {
  value: User;
  expiresAt: number;
  fetchedAt: number;
};

type UserDataResult = {
  user: UserNode;
  fetchedAt: Date;
};

type LanguageData = {
  user: {
    repositories: Pick<UserNode["repositories"], "nodes">;
  };
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
    followers {
      totalCount
    }
    following {
      totalCount
    }
    repositories(
      first: 1
      privacy: PUBLIC
      isFork: false
      orderBy: { field: UPDATED_AT, direction: DESC }
    ) {
      totalCount
      nodes { name }
    }
    starredRepositories {
      totalCount
    }
    watching {
      totalCount
    }
  }
}`;

  const languageQuery = `query ($login: String!) {
  user(login: $login) {
    repositories(first: 10, privacy: PUBLIC, isFork: false, orderBy: { field: UPDATED_AT, direction: DESC }) {
      nodes {
        name
        languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
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
  }
}`;

  try {
    const octokit = getOctokit();
    const result = await octokit.graphql<User>(query, { login: user });
    const languageData = await octokit.graphql<LanguageData>(languageQuery, {
      login: user,
    });
    result.user.repositories.nodes = languageData.user.repositories.nodes;

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
