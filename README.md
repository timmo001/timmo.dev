# Timmo Website

Personal website for Aidan Timson (Timmo), built with [Astro](https://astro.build/).

## Stack

- Astro
- [Groundwork](https://groundwork.timmo.dev) web components and tokens, with the site's own Timmo theme
- Cloudflare Workers (on-demand rendering for `/stats`)
- GitHub GraphQL API via Octokit

## Development

```sh
mise install
aube install
aube run dev
```

Node and aube are pinned in `mise.toml`. aube installs from `pnpm-lock.yaml`, which stays the lockfile so Renovate keeps updating it. Run the local and CI checks in parallel with:

```sh
mise run check ::: build
```

Oxlint checks maintained source and tooling with type-aware rules and the shared
Timmo recommended config. `astro check` checks TypeScript and `.astro` files.
TypeScript uses 6.0 until Astro supports the TypeScript 7 compiler API;
see [Astro's tracking discussion](https://github.com/withastro/roadmap/discussions/1321).

## Environment

Copy `.env.example` to `.env` and set `GITHUB_TOKEN` for the stats page.

For local Worker previews, use an untracked `.dev.vars` file instead. In
production, `GITHUB_TOKEN` is a Worker secret set outside the deploy stack,
which leaves it in place, and `GITHUB_USERNAME` defaults to `timmo001`.
`/projects` and the card demos are rendered per request with that secret, and
`/projects` keeps its static fallback when GitHub isn't available.

`GITHUB_API_URL` is optional and points the GitHub fetchers at another API
base, such as a local mock, when working on the stats, activity, and card
pages offline.

Two optional overrides help when working on Home Assistant project demos
locally. `HA_EMBED_SCRIPT_URL` loads Home Assistant's embed from another
server, such as a local build of its demo. `HA_DEMO_LOCAL_URL` is a server of
local checkouts: a project's `<repo>/demo.yaml` and its release script's name
in `<repo>/dist/` from there replace those of its latest release, so build
each project with a `demo.yaml` first. Projects still need a release to show
up.

## Cloudflare Workers

The site and the `www.timmo.dev` redirect are two Workers in one
[Alchemy](https://alchemy.run) stack, `alchemy.run.ts`. Pushing to `master`
deploys its prod stage from GitHub Actions (`.github/workflows/deploy.yml`).
To see or apply a change by hand:

```sh
mise run plan
mise run deploy
aube run preview
```

`mise run deploy` builds and deploys both Workers and their custom domains, so
run it only when that change is intended. Any other stage, such as
`bun alchemy deploy --stage pr-123`, deploys the site as a preview of the prod
Worker with no custom domain; remove it with `bun alchemy destroy --stage pr-123`.
CI's Cloudflare token comes from `stacks/github.ts`; `mise run deploy:github`
mints it into the repository's secrets, and again to rotate it.

## GitHub Profile Cards

The Worker publishes cached SVG cards for the GitHub profile README at
[timmo001/timmo001](https://github.com/timmo001/timmo001). Each card is a
self-contained SVG with Geist embedded, coloured from the Timmo theme's dark roles (`src/generated/timmo-palette.ts`, written by `aube run theme:gen`), built as a `CardSpec` in
`src/lib/cards/*` and served by `src/pages/github/*.svg.ts`. The README uses
the combined image; every section is also available on its own:

- `https://timmo.dev/github/readme.svg`: every card below in one image
- `https://timmo.dev/github/header.svg`: name and role
- `https://timmo.dev/github/stats.svg`: contributions, pull requests, streaks
- `https://timmo.dev/github/contributions.svg`: contribution calendar
- `https://timmo.dev/github/contributing.svg`: upstream repos, last 60 days
- `https://timmo.dev/github/activity.svg`: own repos, last 60 days
- `https://timmo.dev/github/releases.svg`: latest releases across repos
- `https://timmo.dev/github/top-languages.svg`: language share
- `https://timmo.dev/github/footer.svg`: generation stamp

The endpoints use the existing `GITHUB_TOKEN` Worker secret and configured
`GITHUB_USERNAME`. The identity text lives in `src/data/readme.ts`. The embedded font subset in `src/generated/geist-subset.ts`
is regenerated with `pnpm font:subset`.
