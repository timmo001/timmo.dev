import { addCacheExpiry, isCacheValid } from "~/lib/dates";
import { getEnv } from "~/env";
import { STATS_CACHE_TTL_MS } from "~/lib/stats-cache";
import { type User, type UserNode } from "~/types/github/user";

async function queryGitHub<T>(
  query: string,
  variables: Record<string, string>,
): Promise<T> {
  const token = getEnv().GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "timmo.dev",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json<{
    data?: T;
    errors?: Array<{ message: string }>;
  }>();
  if (!response.ok || result.errors || !result.data) {
    throw new Error(
      result.errors?.map(({ message }) => message).join("; ") ||
        `GitHub GraphQL request failed with ${response.status}`,
    );
  }

  return result.data;
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

export type ProfileStats = {
  totalStars: number;
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
};

type LanguageData = {
  user: {
    repositories: Pick<UserNode["repositories"], "nodes">;
  };
};

const userCache = new Map<string, CacheEntry>();
const profileCache = new Map<
  string,
  { value: ProfileStats; expiresAt: number }
>();

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
      nodes {
        name
        stargazerCount
      }
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
    repositories(first: 25, privacy: PUBLIC, isFork: false, orderBy: { field: UPDATED_AT, direction: DESC }) {
      nodes {
        name
        stargazerCount
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
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
    const result = await queryGitHub<User>(query, { login: user });
    const languageData = await queryGitHub<LanguageData>(languageQuery, {
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

export async function getProfileStats(user: string): Promise<ProfileStats> {
  const cached = profileCache.get(user);
  if (cached && isCacheValid(cached.expiresAt)) {
    return cached.value;
  }

  const token = getEnv().GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "timmo.dev",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const requestJson = async <T>(url: string): Promise<T> => {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GitHub REST request failed with ${response.status}`);
    }
    return response.json<T>();
  };
  const year = new Date().getUTCFullYear();
  const [repositories, commits, pullRequests, issues] = await Promise.all([
    requestJson<Array<{ stargazers_count: number }>>(
      `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&type=owner`,
    ),
    requestJson<{ total_count: number }>(
      `https://api.github.com/search/commits?per_page=1&q=author:${encodeURIComponent(user)}+committer-date:>=${year}-01-01`,
    ),
    requestJson<{ total_count: number }>(
      `https://api.github.com/search/issues?per_page=1&q=author:${encodeURIComponent(user)}+type:pr`,
    ),
    requestJson<{ total_count: number }>(
      `https://api.github.com/search/issues?per_page=1&q=author:${encodeURIComponent(user)}+type:issue`,
    ),
  ]);
  const value = {
    totalStars: repositories.reduce(
      (total, repository) => total + repository.stargazers_count,
      0,
    ),
    totalCommits: commits.total_count,
    totalPullRequests: pullRequests.total_count,
    totalIssues: issues.total_count,
  };
  profileCache.set(user, {
    value,
    expiresAt: addCacheExpiry(Date.now(), STATS_CACHE_TTL_MS),
  });
  return value;
}
