import { type HaProjectKind } from "~/lib/ha-project-kinds";

export type { HaProjectKind };

export type GitHubHaProject = {
  name: string;
  description: string | null;
  url: string;
  isArchived: boolean;
  lastUpdatedAt: string | null;
  languageNames: Array<string>;
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
        languages: {
          edges: Array<{
            node: {
              name: string;
            };
          }>;
        };
      }>;
    };
  };
};
