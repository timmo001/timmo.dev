import { Octokit } from "octokit";

import { getEnv } from "~/env";
import {
  HA_DEMO_FILE,
  parseHaDemoFile,
  type HaProjectDemo,
} from "~/lib/ha-project-demo";
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
        latestRelease {
          tagName
          tagCommit {
            demoFile: file(path: "${HA_DEMO_FILE}") {
              object {
                ... on Blob {
                  text
                }
              }
            }
          }
          releaseAssets(first: 20) {
            nodes {
              name
              downloadUrl
            }
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

function getDemo(
  repo: HaProjectsQueryResult["user"]["repositories"]["nodes"][number],
): HaProjectDemo | null {
  const release = repo.latestRelease;
  const demoText = release?.tagCommit?.demoFile?.object?.text;

  if (!release || !demoText) {
    return null;
  }

  const [script, ...otherScripts] = release.releaseAssets.nodes.filter(
    (asset) => asset.name.endsWith(".js"),
  );

  if (!script || otherScripts.length > 0) {
    console.warn(
      `${repo.name} ${release.tagName} has ${HA_DEMO_FILE} but not exactly one script asset; skipping its demo.`,
    );

    return null;
  }

  const pagePath = `/demos/${repo.name}`;

  try {
    return {
      ...parseHaDemoFile(demoText),
      pagePath,
      script: {
        name: script.name,
        path: `${pagePath}/${script.name}`,
        downloadUrl: script.downloadUrl,
      },
    };
  } catch (error) {
    console.warn(
      `${repo.name} ${release.tagName} has an invalid ${HA_DEMO_FILE}; skipping its demo.`,
      error,
    );

    return null;
  }
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
    demo: getDemo(repo),
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
      .filter((project) => project !== null);

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
