import { type NavItem, projects } from "~/data/navigation";
import { featuredProjectHrefs } from "~/data/readme";

export type FeaturedProject = NavItem & {
  /** Repository name under the configured GitHub user, when known. */
  repositoryName: string | null;
  slug: string;
};

export function getRepositoryName(
  item: Pick<NavItem, "href" | "githubHref">,
  username: string,
): string | null {
  for (const candidate of [item.githubHref, item.href]) {
    if (!candidate) {
      continue;
    }

    try {
      const { hostname, pathname } = new URL(candidate);

      const [owner, name] = pathname.split("/").filter(Boolean);

      if (
        hostname === "github.com" &&
        owner?.toLowerCase() === username.toLowerCase() &&
        name
      ) {
        return name;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getFeaturedProjects(username: string): Array<FeaturedProject> {
  return featuredProjectHrefs.flatMap((href) => {
    const item = projects.find((project) => project.href === href);

    if (!item) {
      return [];
    }

    const repositoryName = getRepositoryName(item, username);

    return [
      {
        ...item,
        repositoryName,
        slug: repositoryName ?? slugify(item.title),
      },
    ];
  });
}

export function getFeaturedProject(
  username: string,
  slug: string,
): FeaturedProject | undefined {
  return getFeaturedProjects(username).find((project) => project.slug === slug);
}
