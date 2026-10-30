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
  type HaProjectDemoFilesQueryResult,
  type HaProjectsQueryResult,
} from "~/types/github/ha-project";

type HaProjectRepo =
  HaProjectsQueryResult["user"]["repositories"]["nodes"][number];

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
          releaseAssets(first: 100) {
            totalCount
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

function getLastUpdatedAt(repo: HaProjectRepo): string | null {
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

// Commit.file errors when the file is missing, while Repository.object
// returns null, so the demo files are read in a second query by tag.
async function fetchDemoFiles(
  octokit: Octokit,
  owner: string,
  repos: Array<HaProjectRepo>,
): Promise<Map<string, string>> {
  const released = repos.flatMap((repo) =>
    repo.latestRelease
      ? [{ name: repo.name, tagName: repo.latestRelease.tagName }]
      : [],
  );

  if (released.length === 0) {
    return new Map();
  }

  const fields = released.map(
    (
      _,
      index,
    ) => `repo${index}: repository(owner: $owner, name: $name${index}) {
      object(expression: $expression${index}) {
        ... on Blob {
          text
        }
      }
    }`,
  );

  const declarations = released.flatMap((_, index) => [
    `$name${index}: String!`,
    `$expression${index}: String!`,
  ]);

  try {
    const result = await octokit.graphql<HaProjectDemoFilesQueryResult>(
      `query ($owner: String!, ${declarations.join(", ")}) {
        ${fields.join("\n")}
      }`,
      Object.fromEntries<string>([
        ["owner", owner],
        ...released.flatMap(({ name, tagName }, index) => [
          [`name${index}`, name] as const,
          [`expression${index}`, `${tagName}:${HA_DEMO_FILE}`] as const,
        ]),
      ]),
    );

    return new Map(
      released.flatMap((repo, index) => {
        const text = result[`repo${index}`]?.object?.text;

        return text ? [[repo.name, text] as const] : [];
      }),
    );
  } catch (error) {
    // Keep the synced projects when only their demos can't be read.
    console.warn("GitHub HA demo sync unavailable; skipping demos.", error);

    return new Map();
  }
}

function getDemo(
  repo: HaProjectRepo,
  demoText: string | undefined,
): HaProjectDemo | null {
  const release = repo.latestRelease;

  if (!release || !demoText) {
    return null;
  }

  const assets = release.releaseAssets;

  if (assets.totalCount > assets.nodes.length) {
    console.warn(
      `${repo.name} ${release.tagName} has more than ${assets.nodes.length} assets; skipping its demo.`,
    );

    return null;
  }

  const [script, ...otherScripts] = assets.nodes.filter((asset) =>
    asset.name.endsWith(".js"),
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
  repo: HaProjectRepo,
  demoText: string | undefined,
): GitHubHaProject {
  return {
    name: repo.name,
    description: repo.description,
    url: repo.url,
    isArchived: repo.isArchived,
    lastUpdatedAt: getLastUpdatedAt(repo),
    demo: getDemo(repo, demoText),
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

    const repos = result.user.repositories.nodes.filter(
      (repo) => getHaProjectKind(repo.name) !== null,
    );

    const demoFiles = await fetchDemoFiles(octokit, env.GITHUB_USERNAME, repos);

    const projects = repos.map((repo) =>
      mapRepoToHaProject(repo, demoFiles.get(repo.name)),
    );

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
