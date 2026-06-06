import { type NavItem } from "~/data/navigation";
import {
  CORE_INTEGRATION_DEFAULT_TAGS,
  CUSTOM_INTEGRATION_DEFAULT_TAGS,
  getCoreDomainFromHref,
  getCustomIntegrationRepoFromHref,
  titleFromCustomIntegrationRepo,
} from "~/lib/ha-integration-kinds";
import { fetchHaIntegrationsFromGitHub } from "~/server/ha-integrations";
import {
  type GitHubHaIntegration,
  type HaIntegrationSource,
} from "~/types/github/ha-integration";

const DEFAULT_CORE_STACK = ["Python"] as const;
const PREFERRED_CUSTOM_STACK = ["Python", "TypeScript", "JavaScript"];

function compareLastUpdated(
  left: string | null | undefined,
  right: string | null | undefined,
): number {
  const leftTime = left ? Date.parse(left) : 0;
  const rightTime = right ? Date.parse(right) : 0;
  return rightTime - leftTime;
}

function getIntegrationSortWeight(item: NavItem): number {
  const tags = item.tags ?? [];

  if (tags.includes("Contribution")) {
    return 0;
  }

  if (tags.includes("HACS")) {
    return 1;
  }

  return 2;
}

function stackFromLanguages(languageNames: Array<string>): Array<string> {
  const stack = PREFERRED_CUSTOM_STACK.filter((language) =>
    languageNames.includes(language),
  );

  if (stack.length > 0) {
    return stack;
  }

  return [...DEFAULT_CORE_STACK];
}

function defaultDescription(title: string, source: HaIntegrationSource): string {
  if (source === "core") {
    return `${title} integration for Home Assistant.`;
  }

  return "";
}

function mergeIntegration(
  source: HaIntegrationSource,
  staticItem: NavItem | undefined,
  githubItem: GitHubHaIntegration | undefined,
): NavItem {
  const title =
    staticItem?.title ??
    (githubItem?.source === "custom" && githubItem.key
      ? titleFromCustomIntegrationRepo(githubItem.key)
      : githubItem?.title ?? "");

  const href = staticItem?.href ?? githubItem?.href ?? "";

  const description =
    staticItem?.description?.trim() ||
    githubItem?.description?.trim() ||
    defaultDescription(title, source);

  const defaultTags =
    source === "core"
      ? [...CORE_INTEGRATION_DEFAULT_TAGS]
      : [...CUSTOM_INTEGRATION_DEFAULT_TAGS];

  return {
    title,
    href,
    description,
    tags: staticItem?.tags ?? defaultTags,
    stack:
      staticItem?.stack ??
      (githubItem ? stackFromLanguages(githubItem.languageNames) : [
          ...DEFAULT_CORE_STACK,
        ]),
  };
}

type IntegrationEntry = {
  key: string;
  source: HaIntegrationSource;
  item: NavItem;
  lastUpdatedAt: string | null;
  staticIndex: number;
};

function buildIntegrationBlock(
  staticIntegrations: Array<NavItem>,
  githubIntegrations: Array<GitHubHaIntegration>,
): Array<NavItem> {
  const staticByCoreDomain = new Map<string, NavItem>();
  const staticByCustomRepo = new Map<string, NavItem>();
  const staticIndexByKey = new Map<string, number>();

  for (const [index, item] of staticIntegrations.entries()) {
    const coreDomain = getCoreDomainFromHref(item.href);
    if (coreDomain) {
      staticByCoreDomain.set(coreDomain, item);
      staticIndexByKey.set(`core:${coreDomain}`, index);
    }

    const customRepo = getCustomIntegrationRepoFromHref(item.href);
    if (customRepo) {
      staticByCustomRepo.set(customRepo, item);
      staticIndexByKey.set(`custom:${customRepo}`, index);
    }
  }

  const githubByKey = new Map(
    githubIntegrations.map((integration) => [
      `${integration.source}:${integration.key}`,
      integration,
    ]),
  );

  const keys = new Set([
    ...[...staticByCoreDomain.keys()].map((key) => `core:${key}`),
    ...[...staticByCustomRepo.keys()].map((key) => `custom:${key}`),
    ...githubByKey.keys(),
  ]);

  const entries: Array<IntegrationEntry> = [];

  for (const compositeKey of keys) {
    const [source, key] = compositeKey.split(":") as [
      HaIntegrationSource,
      string,
    ];
    const githubItem = githubByKey.get(compositeKey);

    if (githubItem?.isArchived) {
      const hasStatic =
        source === "core"
          ? staticByCoreDomain.has(key)
          : staticByCustomRepo.has(key);
      if (!hasStatic) {
        continue;
      }
    }

    const staticItem =
      source === "core"
        ? staticByCoreDomain.get(key)
        : staticByCustomRepo.get(key);

    entries.push({
      key,
      source,
      item: mergeIntegration(source, staticItem, githubItem),
      lastUpdatedAt: githubItem?.lastUpdatedAt ?? null,
      staticIndex: staticIndexByKey.get(compositeKey) ?? Number.MAX_SAFE_INTEGER,
    });
  }

  return entries
    .toSorted((left, right) => {
      const weightDiff =
        getIntegrationSortWeight(left.item) -
        getIntegrationSortWeight(right.item);
      if (weightDiff !== 0) {
        return weightDiff;
      }

      const dateDiff = compareLastUpdated(
        left.lastUpdatedAt,
        right.lastUpdatedAt,
      );
      if (dateDiff !== 0) {
        return dateDiff;
      }

      return left.staticIndex - right.staticIndex;
    })
    .map((entry) => entry.item);
}

export async function mergeIntegrationsWithGitHub(
  staticIntegrations: Array<NavItem>,
): Promise<{
  integrations: Array<NavItem>;
  integrationsSynced: boolean;
}> {
  const fetchResult = await fetchHaIntegrationsFromGitHub();
  const integrations = buildIntegrationBlock(
    staticIntegrations,
    fetchResult?.integrations ?? [],
  );

  return {
    integrations,
    integrationsSynced: fetchResult !== null,
  };
}
