export type HaIntegrationSource = "core" | "custom";

export type GitHubHaIntegration = {
  key: string;
  source: HaIntegrationSource;
  title: string;
  description: string | null;
  href: string;
  isArchived: boolean;
  lastUpdatedAt: string | null;
  languageNames: Array<string>;
};

export type HaCoreManifest = {
  domain: string;
  name: string;
  documentation?: string;
  codeowners?: Array<string>;
};

export type HaIntegrationsQueryResult = {
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
