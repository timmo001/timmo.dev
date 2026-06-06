# Repository Guidance

## Project Shape
- Single-package Astro 6 site using pnpm; `pnpm-lock.yaml` is the package-manager source of truth.
- Requires Node `>=22.12.0` from `package.json#engines`.
- Astro pages live in `src/pages`; shared layout is `src/layouts/Layout.astro`; global Tailwind v4 theme, custom utilities, font face, and motion live in `src/styles/global.css`.
- Use the `~/*` import alias for `src/*`; it is configured in both `tsconfig.json` and `astro.config.mjs`.

## Commands
- Install: `pnpm install`.
- Dev server: `pnpm dev`.
- Production build / main verification: `pnpm build`.
- Preview a built site: `pnpm preview`.
- There are no repo-local `lint`, `test`, `typecheck`, or formatter scripts in `package.json`; do not invent them. CI uses shared workflows for markdown link linting, markdownlint, yamllint, and CodeQL.

## Astro Guidance
- Use the Astro MCP/docs tool for Astro framework questions or API details before relying on memory or generic web searches.

## Runtime And Environment
- Copy `.env.example` to `.env` for local stats work; `GITHUB_TOKEN` is needed for `/stats` because `src/server/github.ts` throws when it is missing.
- `GITHUB_USERNAME` is optional and defaults to `timmo001` in `src/env.ts`.
- `/stats` is server-rendered (`prerender = false`) and uses `server:defer`; cache behavior is shared between GraphQL memory cache, response headers, and Vercel ISR via `src/lib/stats-cache.ts`.
- `astro.config.mjs` uses the Vercel adapter with ISR expiration from `STATS_CACHE_TTL_SECONDS`; update that constant instead of hardcoding matching cache durations elsewhere.

## Data Flow
- Project and contribution cards start from `src/data/navigation.ts`.
- `src/pages/projects.astro` augments Home Assistant projects and integrations from GitHub when `GITHUB_TOKEN` is available, then falls back to static data when sync fails.
- Home Assistant project classification lives in `src/lib/ha-project-kinds.ts`; integration classification lives in `src/lib/ha-integration-kinds.ts`.

## Styling Notes
- Tailwind is wired through `@tailwindcss/vite` in `astro.config.mjs`; there is no `tailwind.config.*` file.
- The site is always rendered with `<html class="dark">` in `Layout.astro`; dark styling is the baseline, not a toggle.
- Motion utilities intentionally respect `prefers-reduced-motion` in `global.css`; keep new reveal/animation patterns inside that media-query structure.
