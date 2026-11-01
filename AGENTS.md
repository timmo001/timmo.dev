# Repository Guidance

## Project Shape

- Single-package Astro 7 site using [aube](https://aube.sh) as the package manager; `pnpm-lock.yaml` is the lockfile and aube reads and writes it in place, so Renovate keeps updating it as a pnpm lockfile.
- Requires Node `>=22.12.0` from `package.json#engines`.
- `mise.toml` pins Node and aube for local checks and CI. `package.json#packageManager` still pins pnpm: Cloudflare Builds reads it to pick its pnpm version, and aube accepts a pnpm pin without complaint.
- `pnpm-workspace.yaml` holds the build approvals (`allowBuilds`) and release-age setting; aube reads it as its workspace config.
- Astro pages live in `src/pages`; shared layout is `src/layouts/Layout.astro`. The UI is built from [Groundwork](https://groundwork.timmo.dev)'s `gw-` web components (`@timmo001/groundwork-ui`) and `--gw-*` tokens (`@timmo001/groundwork-tokens`); site-only styles, the font face and motion live in `src/styles/site.css`.
- Use the `~/*` import alias for `src/*`; it is configured in both `tsconfig.json` and `astro.config.mjs`.

## Commands

- Install: `aube install`. `aube run <script>` installs first when the lockfile or manifest changed; the mise tasks pass `--no-install` because their `install` task has already run.
- Dev server: `mise run serve:site` starts it through Pitchfork in the background; see Background Dev Servers. `aube run dev` is for foreground debugging only.
- Production build / main verification: `aube run build`.
- Preview the built Worker locally: `aube run preview`.
- Deploy from Cloudflare Builds: the `deploy:cloudflare` script. Cloudflare Builds runs it with pnpm, detected from the lockfile, so keep that script and `deploy:preview` free of aube commands.
- Upload a preview version from Cloudflare Builds: the `deploy:preview` script.
- Typecheck: `aube run typecheck`.
- Lint: `aube run lint` (type-aware Oxlint and the shared Timmo recommended rules).
- Format: `aube run format`; check only: `aube run format:check`.
- Run lint, typecheck and format check in parallel: `mise run check`.
- Validate the Worker bundle without deploying: `aube run deploy:dry-run`. Run it with the checks in one parallel run: `mise run check ::: deploy:dry-run`.

## Background Dev Servers

- Start the Astro dev server with `mise run serve:site`, which runs it through Pitchfork in the background and restarts it if it exits or stops responding. Do not run `aube run dev` or `astro dev` in the foreground from an agent.
- Use `mise run serve:site:status`, `mise run serve:site:logs`, `mise run serve:site:restart` and `mise run serve:site:stop` to manage it.
- The daemon is configured in `pitchfork.toml`. It serves `http://127.0.0.1:8090/`, or the next free port, and is always at `https://site.timmo-dev.localhost` through the Pitchfork proxy (Pitchfork turns the dot in the directory name into a hyphen).
- Test through that HTTPS address, in the browser, with curl and anywhere else. Never add the proxy's own port, such as `:8443`, even if Pitchfork prints one: that means the 443 redirect is missing (it's lost on reboot), so run `pitchfork proxy doctor`, then `pitchfork proxy setup -y` to restore it. Use the `127.0.0.1` port only when the proxy isn't running.

## Astro Guidance

- Use the Astro MCP/docs tool for Astro framework questions or API details before relying on memory or generic web searches.
- Keep `astro check` for `.astro` and TypeScript diagnostics. TypeScript 7 is blocked by Astro's dependency on the old compiler API; see [Astro's tracking discussion](https://github.com/withastro/roadmap/discussions/1321). Oxlint's type-aware engine does not replace these checks.

## Runtime And Environment

- Copy `.env.example` to `.env` for Astro development or use an untracked `.dev.vars` for local Worker previews; `GITHUB_TOKEN` is needed for `/stats` because `src/server/github.ts` throws when it is missing.
- `GITHUB_USERNAME` is optional and defaults to `timmo001` in `src/env.ts`.
- `/stats` is server-rendered (`prerender = false`) and uses `server:defer`; cache behaviour is shared between the optional module memory cache and Cloudflare Workers response caching via `src/lib/stats-cache.ts` and the page's `Cache-Control` header.
- Module-level `Map` caches are isolate-local optimisations only. Do not rely on them for persistence or cross-isolate consistency.
- `wrangler.jsonc` contains only non-secret Worker configuration. Configure `GITHUB_TOKEN` as a Worker secret, never as a Wrangler variable or committed value.

## Data Flow

- Project and contribution cards start from `src/data/navigation.ts`.
- `src/pages/projects.astro` augments Home Assistant projects and integrations from GitHub when `GITHUB_TOKEN` is available, then falls back to static data when sync fails.
- Home Assistant project classification lives in `src/lib/ha-project-kinds.ts`; integration classification lives in `src/lib/ha-integration-kinds.ts`.

## Styling Notes

- There's no Tailwind or CSS framework. Build UI from `gw-` elements first, styled through `--gw-*` tokens and the elements' parts; `src/styles/site.css` holds only what's specific to this site (hero type, page layout, the calendar), in plain CSS on tokens.
- When Groundwork lacks something the site needs, add it to Groundwork and release it rather than working around it here.
- The theme is `src/theme/timmo.json`. `aube run theme:gen` (Bun, pinned in `mise.toml`) solves it into `src/styles/theme.generated.css` and `src/generated/timmo-palette.ts`, the dark roles as hex for the README cards; it fails when a role misses its contrast target. Commit both generated files.
- The site is dark only: `Layout.astro` renders `<html data-gw-theme="timmo" data-gw-mode="dark">` and there's no theme switcher, since the logo is drawn for a dark page.
- Pages put their content in `gw-page`, which lines up with `gw-app-bar`; the site's content width is `--gw-content-width` in `site.css`.
- `public/og.png` was drawn from the home hero at 1200×630 in the browser; redraw it the same way if the hero or theme changes.
- Motion respects `prefers-reduced-motion` in `site.css`; keep new reveal/animation patterns inside that media-query structure.
