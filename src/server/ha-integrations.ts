import { Octokit } from "octokit";

import { env } from "~/env";
import { addCacheExpiry, isCacheValid } from "~/lib/dates";
import {
  CUSTOM_INTEGRATION_PREFIX,
  isCustomIntegrationRepo,
} from "~/lib/ha-integration-kinds";
import { STATS_CACHE_TTL_MS } from "~/lib/stats-cache";
import {
  type GitHubHaIntegration,
  type HaCoreManifest,
  type HaIntegrationsQueryResult,
} from "~/types/github/ha-integration";

const HA_CORE_MANIFEST_BASE =
  "https://raw.githubusercontent.com/home-assistant/core/dev/homeassistant/components";

const CORE_INTEGRATION_SEARCH_QUERY =
  "repo:home-assistant/core filename:manifest.json @timmo001";

const HA_INTEGRATIONS_QUERY = `query ($login: String!) {
  user(login: $login) {
    repositories(first: 100, isFork: false, orderBy: { field: UPDATED_AT, direction: DESC }) {
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
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            node {
              name
            }
          }
        }
      }
    }
  }
}`;

export type HaIntegrationsFetchResult = {
  integrations: Array<GitHubHaIntegration>;
  coreSynced: boolean;
  customSynced: boolean;
};

type CacheEntry = {
  value: HaIntegrationsFetchResult;
  expiresAt: number;
};

const haIntegrationsCache = new Map<string, CacheEntry>();

function isTimmoCodeowner(codeowners: Array<string> | undefined): boolean {
  const handle = `@${env.GITHUB_USERNAME.toLowerCase()}`;
  return codeowners?.some((owner) => owner.toLowerCase() === handle) ?? false;
}

function getLastUpdatedAt(
  repo: HaIntegrationsQueryResult["user"]["repositories"]["nodes"][number],
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

async function fetchCoreIntegrationDomains(
  octokit: Octokit,
): Promise<Array<string>> {
  const response = await octokit.rest.search.code({
    per_page: 100,
    q: CORE_INTEGRATION_SEARCH_QUERY,
  });

  const domains = new Set<string>();

  for (const item of response.data.items) {
    const match = item.path.match(
      /^homeassistant\/components\/([^/]+)\/manifest\.json$/,
    );
    if (match?.[1]) {
      domains.add(match[1]);
    }
  }

  return [...domains];
}

async function fetchCoreManifest(
  domain: string,
): Promise<HaCoreManifest | null> {
  const response = await fetch(`${HA_CORE_MANIFEST_BASE}/${domain}/manifest.json`);

  if (!response.ok) {
    return null;
  }

  const manifest = (await response.json()) as HaCoreManifest;

  if (!isTimmoCodeowner(manifest.codeowners)) {
    return null;
  }

  return manifest;
}

async function fetchCoreIntegrations(
  octokit: Octokit,
): Promise<Array<GitHubHaIntegration>> {
  const domains = await fetchCoreIntegrationDomains(octokit);
  const manifests = await Promise.all(domains.map(fetchCoreManifest));

  return manifests
    .filter((manifest): manifest is HaCoreManifest => manifest !== null)
    .map((manifest) => ({
      key: manifest.domain,
      source: "core",
      title: manifest.name,
      description: null,
      href:
        manifest.documentation ??
        `https://www.home-assistant.io/integrations/${manifest.domain}`,
      isArchived: false,
      lastUpdatedAt: null,
      languageNames: ["Python"],
    }));
}

function mapCustomIntegrationRepo(
  repo: HaIntegrationsQueryResult["user"]["repositories"]["nodes"][number],
): GitHubHaIntegration | null {
  if (!isCustomIntegrationRepo(repo.name)) {
    return null;
  }

  return {
    key: repo.name,
    source: "custom",
    title: repo.name.slice(CUSTOM_INTEGRATION_PREFIX.length),
    description: repo.description,
    href: repo.url,
    isArchived: repo.isArchived,
    lastUpdatedAt: getLastUpdatedAt(repo),
    languageNames: repo.languages.edges.map((edge) => edge.node.name),
  };
}

async function fetchCustomIntegrations(
  octokit: Octokit,
): Promise<Array<GitHubHaIntegration>> {
  const result = await octokit.graphql<HaIntegrationsQueryResult>(
    HA_INTEGRATIONS_QUERY,
    { login: env.GITHUB_USERNAME },
  );

  return result.user.repositories.nodes
    .map(mapCustomIntegrationRepo)
    .filter((integration): integration is GitHubHaIntegration => integration !== null);
}

export async function fetchHaIntegrationsFromGitHub(): Promise<HaIntegrationsFetchResult | null> {
  const token = env.GITHUB_TOKEN;
  if (!token) {
    return null;
  }

  const cacheKey = env.GITHUB_USERNAME;
  const cached = haIntegrationsCache.get(cacheKey);
  if (cached && isCacheValid(cached.expiresAt)) {
    return cached.value;
  }

  const octokit = new Octokit({ auth: token });
  const integrations: Array<GitHubHaIntegration> = [];
  let coreSynced = false;
  let customSynced = false;

  try {
    integrations.push(...(await fetchCoreIntegrations(octokit)));
    coreSynced = true;
  } catch (error) {
    console.warn(
      "Home Assistant core integration sync unavailable.",
      error,
    );
  }

  try {
    integrations.push(...(await fetchCustomIntegrations(octokit)));
    customSynced = true;
  } catch (error) {
    console.warn(
      "Home Assistant custom integration sync unavailable.",
      error,
    );
  }

  if (!coreSynced && !customSynced) {
    return null;
  }

  const value = {
    integrations,
    coreSynced,
    customSynced,
  };

  haIntegrationsCache.set(cacheKey, {
    value,
    expiresAt: addCacheExpiry(Date.now(), STATS_CACHE_TTL_MS),
  });

  return value;
}
