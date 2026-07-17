export interface User {
  user: UserNode;
}

export interface UserNode {
  followers: Count;
  following: Count;
  repositories: Repositories;
  starredRepositories: Count;
  watching: Count;
}

export interface Count {
  totalCount: number;
}

export interface Repositories extends Count {
  nodes: RepositoriesNodeElement[];
}

export interface RepositoriesNodeElement {
  name: string;
  languages?: Languages;
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
