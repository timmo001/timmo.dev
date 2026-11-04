import { Octokit } from "octokit";

import { getEnv } from "~/env";
import {
  HA_DEMO_FILE,
  LOCAL_DEMO_TAG,
  parseHaDemoFile,
  type HaProjectDemo,
} from "~/lib/ha-project-demo";
import { getHaProjectKind } from "~/lib/ha-project-kinds";
import { addCacheExpiry, isCacheValid } from "~/lib/dates";
import { PROJECTS_CACHE_TTL_MS } from "~/lib/stats-cache";
import {
  type GitHubHaProject,
  type HaProjectDemoFilesQueryResult,
  type HaProjectsQueryResult,
} from "~/types/github/ha-project";

type HaProjectRepo =
  HaProjectsQueryResult["user"]["repositories"]["nodes"][number];

// What GitHub gave: the projects and the demo files of their releases
type CacheEntry = {
  repos: Array<HaProjectRepo>;
  demoFiles: Map<string, string>;
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

// The demo files of local checkouts, which replace those of the releases.
async function fetchLocalDemoFiles(
  localUrl: string,
  repos: Array<HaProjectRepo>,
): Promise<Map<string, string>> {
  const files = await Promise.all(
    repos.map(async ({ name }) => {
      try {
        const response = await fetch(`${localUrl}/${name}/${HA_DEMO_FILE}`);

        if (!response.ok) {
          // An unread body keeps its connection open, and they run out
          await response.body?.cancel();

          return [];
        }

        return [[name, await response.text()] as const];
      } catch {
        return [];
      }
    }),
  );

  return new Map(files.flat());
}

// A local checkout's demo file replaces the release's, and its build of the
// release's script replaces the release asset.
type LocalDemo = { url: string; demoText: string };

function getDemo(
  repo: HaProjectRepo,
  releaseDemoText: string | undefined,
  local: LocalDemo | undefined,
): HaProjectDemo | null {
  const release = repo.latestRelease;
  const demoText = local?.demoText ?? releaseDemoText;

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
  const source = local ? "local checkout" : release.tagName;
  // The tag gives each release's script its own cache entry.
  const tag = local ? LOCAL_DEMO_TAG : release.tagName;

  try {
    return {
      ...parseHaDemoFile(demoText),
      pagePath,
      script: {
        name: script.name,
        path: `${pagePath}/${script.name}?v=${encodeURIComponent(tag)}`,
        downloadUrl: local
          ? `${local.url}/${repo.name}/dist/${script.name}`
          : script.downloadUrl,
      },
    };
  } catch (error) {
    console.warn(
      `${repo.name} ${source} has an invalid ${HA_DEMO_FILE}; skipping its demo.`,
      error,
    );

    return null;
  }
}

function mapRepoToHaProject(
  repo: HaProjectRepo,
  releaseDemoText: string | undefined,
  local: LocalDemo | undefined,
): GitHubHaProject {
  return {
    name: repo.name,
    description: repo.description,
    url: repo.url,
    isArchived: repo.isArchived,
    lastUpdatedAt: getLastUpdatedAt(repo),
    demo: getDemo(repo, releaseDemoText, local),
  };
}

export async function fetchHaProjectsFromGitHub(): Promise<Array<GitHubHaProject> | null> {
  const env = getEnv();
  const token = env.GITHUB_TOKEN;

  if (!token) {
    return null;
  }

  const github = await fetchGitHubData(token, env.GITHUB_USERNAME);

  if (!github) {
    return null;
  }

  // Local demos change as they're edited, so they're read on every request,
  // while GitHub's data stays cached
  const localUrl = env.HA_DEMO_LOCAL_URL;

  const localDemoFiles = localUrl
    ? await fetchLocalDemoFiles(localUrl, github.repos)
    : new Map<string, string>();

  return github.repos.map((repo) => {
    const localDemoText = localDemoFiles.get(repo.name);

    return mapRepoToHaProject(
      repo,
      github.demoFiles.get(repo.name),
      localUrl && localDemoText
        ? { url: localUrl, demoText: localDemoText }
        : undefined,
    );
  });
}

async function fetchGitHubData(
  token: string,
  username: string,
): Promise<CacheEntry | null> {
  const cached = haProjectsCache.get(username);

  if (cached && isCacheValid(cached.expiresAt)) {
    return cached;
  }

  const octokit = new Octokit({ auth: token });

  try {
    const result = await octokit.graphql<HaProjectsQueryResult>(
      HA_PROJECTS_QUERY,
      { login: username },
    );

    const repos = result.user.repositories.nodes.filter(
      (repo) => getHaProjectKind(repo.name) !== null,
    );

    const entry: CacheEntry = {
      repos,
      demoFiles: await fetchDemoFiles(octokit, username, repos),
      expiresAt: addCacheExpiry(Date.now(), PROJECTS_CACHE_TTL_MS),
    };

    haProjectsCache.set(username, entry);

    return entry;
  } catch (error) {
    console.warn(
      "GitHub HA project sync unavailable; using static project list.",
      error,
    );

    return null;
  }
}
