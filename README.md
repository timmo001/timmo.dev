# Timmo Website

Personal website for Aidan Timson (Timmo), built with [Astro](https://astro.build/).

## Stack

- Astro
- Tailwind CSS
- Cloudflare Workers (on-demand rendering for `/stats`)
- GitHub GraphQL API via Octokit

## Development

```sh
pnpm install
pnpm dev
```

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
