import { Octokit } from "octokit";

import { getEnv } from "~/env";
import { getHaProjectKind } from "~/lib/ha-project-kinds";
import { addCacheExpiry, isCacheValid } from "~/lib/dates";
import { STATS_CACHE_TTL_MS } from "~/lib/stats-cache";
import {
  type GitHubHaProject,
  type HaProjectsQueryResult,
} from "~/types/github/ha-project";

type CacheEntry = {
  value: Array<GitHubHaProject>;
  expiresAt: number;
};

const haProjectsCache = new Map<string, CacheEntry>();

const HA_PROJECTS_QUERY = `query ($login: String!) {
  user(login: $login) {
    repositories(first: 100, privacy: PUBLIC, isFork: false, orderBy: { field: UPDATED_AT, direction: DESC }) {
      nodes {
        name
        description
        url
        isArchived
        pushedAt
        releases(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {
          nodes {
            tagName
            publishedAt
          }
        }
        tagRefs: refs(refPrefix: "refs/tags/", first: 1, orderBy: { field: TAG_COMMIT_DATE, direction: DESC }) {
          nodes {
            name
            target {
              ... on Commit {
                committedDate
              }
              ... on Tag {
                target {
                  ... on Commit {
                    committedDate
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

function getLastUpdatedAt(
  repo: HaProjectsQueryResult["user"]["repositories"]["nodes"][number],
): string | null {
  const releaseDate = repo.releases.nodes[0]?.publishedAt;
  if (releaseDate) {
    return releaseDate;
  }

  const tagTarget = repo.tagRefs.nodes[0]?.target;
  const tagDate =
    tagTarget?.committedDate ?? tagTarget?.target?.committedDate ?? null;
  if (tagDate) {
    return tagDate;
  }

  return repo.pushedAt ?? null;
}

function mapRepoToHaProject(
  repo: HaProjectsQueryResult["user"]["repositories"]["nodes"][number],
): GitHubHaProject | null {
  if (getHaProjectKind(repo.name) === null) {
    return null;
  }

  return {
    name: repo.name,
    description: repo.description,
    url: repo.url,
    isArchived: repo.isArchived,
    lastUpdatedAt: getLastUpdatedAt(repo),
  };
}

export async function fetchHaProjectsFromGitHub(): Promise<Array<GitHubHaProject> | null> {
  const env = getEnv();
  const token = env.GITHUB_TOKEN;
  if (!token) {
    return null;
  }

  const cacheKey = env.GITHUB_USERNAME;
  const cached = haProjectsCache.get(cacheKey);
  if (cached && isCacheValid(cached.expiresAt)) {
    return cached.value;
  }

  const octokit = new Octokit({ auth: token });

  try {
    const result = await octokit.graphql<HaProjectsQueryResult>(
      HA_PROJECTS_QUERY,
      { login: env.GITHUB_USERNAME },
    );

    const projects = result.user.repositories.nodes
      .map(mapRepoToHaProject)
      .filter((project): project is GitHubHaProject => project !== null);

    haProjectsCache.set(cacheKey, {
      value: projects,
      expiresAt: addCacheExpiry(Date.now(), STATS_CACHE_TTL_MS),
    });

    return projects;
  } catch (error) {
    console.warn(
      "GitHub HA project sync unavailable; using static project list.",
      error,
    );
    return null;
  }
}
