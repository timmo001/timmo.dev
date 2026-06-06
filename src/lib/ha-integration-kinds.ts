export const CUSTOM_INTEGRATION_PREFIX = "homeassistant-integration-";

export const CORE_INTEGRATION_DEFAULT_TAGS = [
  "Contribution",
  "Home Assistant Integration",
] as const;

export const CUSTOM_INTEGRATION_DEFAULT_TAGS = [
  "Home Assistant Integration",
] as const;

export function isCustomIntegrationRepo(repoName: string): boolean {
  return repoName.startsWith(CUSTOM_INTEGRATION_PREFIX);
}

export function getCoreDomainFromHref(href: string): string | null {
  try {
    const match = new URL(href).pathname.match(/\/integrations\/([^/]+)\/?$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function getCustomIntegrationRepoFromHref(href: string): string | null {
  try {
    const repoName = new URL(href).pathname.split("/").filter(Boolean).at(-1);
    if (!repoName || !isCustomIntegrationRepo(repoName)) {
      return null;
    }
    return repoName;
  } catch {
    return null;
  }
}

export function titleFromCustomIntegrationRepo(repoName: string): string {
  return repoName
    .slice(CUSTOM_INTEGRATION_PREFIX.length)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
