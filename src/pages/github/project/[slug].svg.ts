import type { APIRoute } from "astro";

import { getUsername } from "~/lib/github";
import {
  notFoundResponse,
  renderProjectCard,
  svgResponse,
} from "~/lib/github-card";
import { getFeaturedProject, getFeaturedProjects } from "~/lib/readme-projects";
import { getRepositorySummaries } from "~/server/github-readme";

export const prerender = false;

export const GET = (async ({ params }) => {
  const username = getUsername();

  const project = params.slug
    ? getFeaturedProject(username, params.slug)
    : undefined;

  if (!project) {
    return notFoundResponse();
  }

  const featured = getFeaturedProjects(username);

  const index = featured.findIndex((item) => item.slug === project.slug);

  let stars: number | undefined;

  let language: { name: string; color: string | null } | undefined;

  if (project.repositoryName) {
    try {
      // One query covers every featured project, so the cards share a cache entry.
      const summaries = await getRepositorySummaries(
        username,
        featured.flatMap((item) =>
          item.repositoryName ? [item.repositoryName] : [],
        ),
      );

      const summary = summaries.find(
        (item) =>
          item.name.toLowerCase() === project.repositoryName?.toLowerCase(),
      );

      stars = summary?.stargazerCount;
      language = summary?.primaryLanguage ?? undefined;
    } catch (error) {
      console.error(error);
    }
  }

  return svgResponse(
    renderProjectCard({
      title: project.title,
      description: project.description,
      tags: project.tags,
      stack: project.stack,
      stars,
      language,
      side: index % 2 === 0 ? "left" : "right",
    }),
  );
}) satisfies APIRoute;
