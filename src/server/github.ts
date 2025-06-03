"use server";
import { Octokit } from "octokit";

import { type User } from "~/types/github/user";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function getUserData(user: string): Promise<User> {
  const query = `query ($login: String!) {
  user(login: $login) {
    id
    name
    avatarUrl
    bio
    email
    login
    contributionsCollection {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
    }
    followers {
      totalCount
    }
    following {
      totalCount
    }
    repositories(
      first: 100
      isFork: false
      orderBy: { field: UPDATED_AT, direction: DESC }
    ) {
      totalCount
      totalDiskUsage
      nodes {
        name
        languages(first: 100, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
    starredRepositories {
      totalCount
    }
    socialAccounts(first: 100) {
      nodes {
        displayName
        provider
        url
      }
    }
    status {
      message
      emoji
      emojiHTML
    }
    watching {
      totalCount
    }
  }
}`;

  try {
    return await octokit.graphql<User>(query, {
      login: user,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
