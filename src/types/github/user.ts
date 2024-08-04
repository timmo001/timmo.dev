export interface User {
  user: UserNode;
}

export interface UserNode {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  email: string;
  login: string;
  contributionsCollection: ContributionsCollection;
  followers: Count;
  following: Count;
  repositories: Repositories;
  socialAccounts: SocialAccounts;
  starredRepositories: Count;
  status: Status;
  watching: Count;
}

export interface ContributionsCollection {
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
}

export interface Count {
  totalCount: number;
}

export interface Repositories extends Count {
  totalDiskUsage: number;
  nodes: RepositoriesNodeElement[];
}

export interface RepositoriesNodeElement {
  name: string;
  languages: Languages;
}

export interface Languages {
  edges: Edge[];
}

export interface Edge {
  size: number;
  node: EdgeNode;
}

export interface EdgeNode {
  name: string;
  color: string;
}

export interface SocialAccounts {
  nodes: Array<SocialAccountNode>;
}

export interface SocialAccountNode {
  displayName: string;
  provider: string;
  url: string;
}

export interface Status {
  message: string;
  emoji: string;
  emojiHTML: string;
}
