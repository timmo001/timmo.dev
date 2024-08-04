"use server";
import { promises as fs } from "fs";
import { Octokit } from "octokit";

import { User } from "~/types/github/user";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function getUserData(user: string): Promise<User> {
  const query = await fs.readFile(
    `${process.cwd()}/src/lib/graphql/user.graphql`,
    "utf-8",
  );
  try {
    return await octokit.graphql<User>(query, {
      login: user,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
