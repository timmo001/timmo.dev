# Timmo Website

Personal website for Aidan Timson (Timmo), built with [Astro](https://astro.build/).

## Stack

- Astro 6
- Tailwind CSS v4
- Vercel adapter (on-demand rendering for `/stats`)
- GitHub GraphQL API via Octokit

## Development

```sh
pnpm install
pnpm dev
```

## Environment

Copy `.env.example` to `.env` and set `GITHUB_TOKEN` for the stats page.
