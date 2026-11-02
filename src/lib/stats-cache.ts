export const STATS_CACHE_TTL_MS = 60 * 60 * 1000;

export const STATS_CACHE_TTL_SECONDS = STATS_CACHE_TTL_MS / 1000;

export const STATS_CACHE_TTL_LABEL = "1 hour";

// Shorter for the projects and card demos, so a new release shows up soon.
export const PROJECTS_CACHE_TTL_MS = 10 * 60 * 1000;

export const PROJECTS_CACHE_TTL_SECONDS = PROJECTS_CACHE_TTL_MS / 1000;

// How long the edge may serve a stale page while it refreshes it in the
// background, so a visitor rarely waits on the GitHub sync.
export const PROJECTS_STALE_SECONDS = 24 * 60 * 60;
