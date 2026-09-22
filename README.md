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

Node and pnpm are pinned in `mise.toml`. Run the local and CI checks with:

```sh
mise run check
mise run deploy:dry-run
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

The Worker publishes cached SVG cards for use in the GitHub profile README:

- `https://timmo.dev/github/stats.svg`
- `https://timmo.dev/github/top-languages.svg`
- `https://timmo.dev/github/readme.svg`

Both endpoints use the existing `GITHUB_TOKEN` Worker secret and configured
`GITHUB_USERNAME`.
