import { type HaProjectDemo } from "~/lib/ha-project-demo";

export type GitHubHaProject = {
  name: string;
  description: string | null;
  url: string;
  isArchived: boolean;
  lastUpdatedAt: string | null;
  demo: HaProjectDemo | null;
};

export type HaProjectsQueryResult = {
  user: {
    repositories: {
      nodes: Array<{
        name: string;
        description: string | null;
        url: string;
        isArchived: boolean;
        pushedAt: string;
        releases: {
          nodes: Array<{
            tagName: string;
            publishedAt: string | null;
          }>;
        };
        latestRelease: {
          tagName: string;
          releaseAssets: {
            nodes: Array<{
              name: string;
              downloadUrl: string;
            }>;
          };
        } | null;
        tagRefs: {
          nodes: Array<{
            name: string;
            target: {
              committedDate?: string;
              target?: {
                committedDate?: string;
              };
            };
          }>;
        };
      }>;
    };
  };
};

export type HaProjectDemoFilesQueryResult = Record<
  string,
  { object: { text?: string | null } | null } | null
>;
