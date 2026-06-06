import { type NavItem } from "~/data/navigation";
import {
  getHaProjectKind,
  getRepoNameFromHref,
  HA_PROJECT_DEFAULT_TAGS,
  HA_PROJECT_KIND_ORDER,
  titleFromHaRepoName,
  type HaProjectKind,
} from "~/lib/ha-project-kinds";
import { fetchHaProjectsFromGitHub } from "~/server/ha-projects";
import { type GitHubHaProject } from "~/types/github/ha-project";

const PREFERRED_STACK = ["TypeScript", "JavaScript", "Lit", "CSS", "HTML"];

function isHaProjectNavItem(item: NavItem): boolean {
  return getRepoNameFromHref(item.href) !== null;
}

function stackFromLanguages(languageNames: Array<string>): Array<string> {
  const stack = PREFERRED_STACK.filter((language) =>
    languageNames.includes(language),
  );

  if (
    stack.includes("TypeScript") &&
    !stack.includes("Lit") &&
    languageNames.includes("HTML")
  ) {
    stack.push("Lit");
  }

  if (stack.length > 0) {
    return stack;
  }

  if (languageNames.length > 0) {
    return languageNames.slice(0, 4);
  }

  return ["TypeScript", "Lit"];
}

function mergeHaProject(
  repoName: string,
  kind: HaProjectKind,
  staticItem: NavItem | undefined,
  githubItem: GitHubHaProject | undefined,
): NavItem {
  const href =
    staticItem?.href ??
    githubItem?.url ??
    `https://github.com/timmo001/${repoName}`;

  const description =
    githubItem?.description?.trim() ||
    staticItem?.description ||
    "";

  return {
    title: staticItem?.title ?? titleFromHaRepoName(repoName, kind),
    href,
    description,
    tags: staticItem?.tags ?? HA_PROJECT_DEFAULT_TAGS[kind],
    stack:
      staticItem?.stack ??
      (githubItem
        ? stackFromLanguages(githubItem.languageNames)
        : ["TypeScript", "Lit"]),
  };
}

function compareLastUpdated(
  left: string | null | undefined,
  right: string | null | undefined,
): number {
  const leftTime = left ? Date.parse(left) : 0;
  const rightTime = right ? Date.parse(right) : 0;
  return rightTime - leftTime;
}

type HaProjectEntry = {
  repoName: string;
  kind: HaProjectKind;
  item: NavItem;
  lastUpdatedAt: string | null;
  staticIndex: number;
};

function buildHaProjectBlock(
  haStatic: Array<NavItem>,
  githubProjects: Array<GitHubHaProject>,
): Array<NavItem> {
  const staticByRepo = new Map<string, NavItem>();
  const staticIndexByRepo = new Map<string, number>();

  for (const [index, item] of haStatic.entries()) {
    const repoName = getRepoNameFromHref(item.href);
    if (repoName) {
      staticByRepo.set(repoName, item);
      staticIndexByRepo.set(repoName, index);
    }
  }

  const githubByRepo = new Map(
    githubProjects.map((project) => [project.name, project]),
  );

  const repoNames = new Set([...staticByRepo.keys(), ...githubByRepo.keys()]);

  const entries: Array<HaProjectEntry> = [];

  for (const repoName of repoNames) {
    const kind = getHaProjectKind(repoName);
    if (!kind) {
      continue;
    }

    const githubItem = githubByRepo.get(repoName);
    if (githubItem?.isArchived && !staticByRepo.has(repoName)) {
      continue;
    }

    entries.push({
      repoName,
      kind,
      item: mergeHaProject(
        repoName,
        kind,
        staticByRepo.get(repoName),
        githubItem,
      ),
      lastUpdatedAt: githubItem?.lastUpdatedAt ?? null,
      staticIndex: staticIndexByRepo.get(repoName) ?? Number.MAX_SAFE_INTEGER,
    });
  }

  return entries
    .toSorted((left, right) => {
      const kindDiff =
        HA_PROJECT_KIND_ORDER[left.kind] - HA_PROJECT_KIND_ORDER[right.kind];
      if (kindDiff !== 0) {
        return kindDiff;
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

export async function mergeProjectsWithHaGitHub(
  staticProjects: Array<NavItem>,
): Promise<Array<NavItem>> {
  const firstHaIndex = staticProjects.findIndex(isHaProjectNavItem);
  if (firstHaIndex === -1) {
    return staticProjects;
  }

  let lastHaIndex = firstHaIndex;
  for (let index = firstHaIndex + 1; index < staticProjects.length; index++) {
    if (isHaProjectNavItem(staticProjects[index]!)) {
      lastHaIndex = index;
    } else {
      break;
    }
  }

  const prefix = staticProjects.slice(0, firstHaIndex);
  const haStatic = staticProjects.slice(firstHaIndex, lastHaIndex + 1);
  const suffix = staticProjects.slice(lastHaIndex + 1);

  const githubProjects = await fetchHaProjectsFromGitHub();
  const haBlock = buildHaProjectBlock(haStatic, githubProjects ?? []);

  return [...prefix, ...haBlock, ...suffix];
}
