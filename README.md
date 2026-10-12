# Timmo Website

Personal website for Aidan Timson (Timmo), built with [Astro](https://astro.build/).

## Stack

- Astro
- Tailwind CSS
- Cloudflare Workers (on-demand rendering for `/stats`)
- GitHub GraphQL API via Octokit

## Development

```sh
mise install
pnpm install
pnpm dev
```

Node and pnpm are pinned in `mise.toml`. Run the local and CI checks in parallel with:

```sh
mise run check ::: deploy:dry-run
```

Oxlint checks maintained source and tooling with type-aware rules and the shared
Timmo recommended config. `astro check` checks TypeScript and `.astro` files.
TypeScript uses 6.0 until Astro supports the TypeScript 7 compiler API;
see [Astro's tracking discussion](https://github.com/withastro/roadmap/discussions/1321).

## Environment

Copy `.env.example` to `.env` and set `GITHUB_TOKEN` for the stats page.

For local Worker previews, use an untracked `.dev.vars` file instead. In
production, configure `GITHUB_TOKEN` as a Worker secret and optionally set the
non-secret `GITHUB_USERNAME` build and runtime variable. `/projects` keeps its
static fallback when no token is available during the build.

## Cloudflare Workers

```sh
pnpm deploy:dry-run
pnpm preview
```

The Worker is configured in `wrangler.jsonc`. `pnpm deploy` builds and deploys
it; deployment can create or update the configured custom domain, so run it
only when that change is intended.

## GitHub Profile Cards

The Worker publishes cached SVG cards for the GitHub profile README at
[timmo001/timmo001](https://github.com/timmo001/timmo001). Each card is a
self-contained SVG with Geist embedded, rendered from `src/lib/cards/*` and
served by `src/pages/github/*.svg.ts`:

- `https://timmo.dev/github/header.svg`: name, role, and the busiest upstream repo
- `https://timmo.dev/github/link/{id}.svg`: link buttons from `src/data/readme.ts`
- `https://timmo.dev/github/stats.svg`: contributions, pull requests, streaks
- `https://timmo.dev/github/contributions.svg`: contribution calendar
- `https://timmo.dev/github/contributing.svg`: upstream repos, last 60 days
- `https://timmo.dev/github/activity.svg`: own repos, last 60 days
- `https://timmo.dev/github/project/{slug}.svg`: featured project cards
- `https://timmo.dev/github/releases.svg`: latest releases across repos
- `https://timmo.dev/github/top-languages.svg`: language share
- `https://timmo.dev/github/footer.svg`: generation stamp
- `https://timmo.dev/github/readme.svg`: stats and languages in one image

The endpoints use the existing `GITHUB_TOKEN` Worker secret and configured
`GITHUB_USERNAME`. Card content (identity, links, featured projects) lives in
`src/data/readme.ts`. The embedded font subset in `src/generated/geist-subset.ts`
is regenerated with `pnpm font:subset`.
