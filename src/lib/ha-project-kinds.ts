export type HaProjectKind = "dashboard" | "card" | "cardFeature";

const KIND_PREFIX: Record<HaProjectKind, string> = {
  dashboard: "ha-dashboard-",
  card: "ha-card-",
  cardFeature: "ha-card-feature-",
};

export const HA_PROJECT_KIND_ORDER: Record<HaProjectKind, number> = {
  dashboard: 0,
  card: 1,
  cardFeature: 2,
};

export const HA_PROJECT_DEFAULT_TAGS: Record<HaProjectKind, Array<string>> = {
  dashboard: ["HACS", "Home Assistant Dashboard"],
  card: ["HACS", "Home Assistant Card"],
  cardFeature: ["HACS", "Home Assistant Card Feature"],
};

export function getHaProjectKind(repoName: string): HaProjectKind | null {
  if (repoName.startsWith(KIND_PREFIX.dashboard)) {
    return "dashboard";
  }
  if (repoName.startsWith(KIND_PREFIX.cardFeature)) {
    return "cardFeature";
  }
  if (repoName.startsWith(KIND_PREFIX.card)) {
    return "card";
  }
  return null;
}

export function getHaProjectPrefix(kind: HaProjectKind): string {
  return KIND_PREFIX[kind];
}

const HA_SUBSECTION_REPO_NAMES = new Set(["home-assistant-tui"]);

export function isHaSubsectionNavItem(href: string): boolean {
  if (getHaProjectKindFromHref(href) !== null) {
    return true;
  }

  try {
    const repoName = new URL(href).pathname.split("/").filter(Boolean).at(-1);
    return repoName !== undefined && HA_SUBSECTION_REPO_NAMES.has(repoName);
  } catch {
    return false;
  }
}

function getHaProjectKindFromHref(href: string): HaProjectKind | null {
  try {
    const repoName = new URL(href).pathname.split("/").filter(Boolean).at(-1);
    if (!repoName) {
      return null;
    }
    return getHaProjectKind(repoName);
  } catch {
    return null;
  }
}

export function getRepoNameFromHref(href: string): string | null {
  try {
    const { pathname } = new URL(href);
    const repoName = pathname.split("/").filter(Boolean).at(-1);
    if (!repoName || getHaProjectKind(repoName) === null) {
      return null;
    }
    return repoName;
  } catch {
    return null;
  }
}

export function titleFromHaRepoName(
  repoName: string,
  kind: HaProjectKind,
): string {
  const prefix = KIND_PREFIX[kind];
  return repoName
    .slice(prefix.length)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
