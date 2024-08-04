import { Language } from "~/types/github/language";
import { Stat } from "~/types/github/stat";
import { UserNode } from "~/types/github/user";
import { getContrastColor, getRGBColorFromHex } from "~/lib/color";

export const USERNAME = process.env.GITHUB_USERNAME || "timmo001";

export function getStats(user: UserNode): Array<Stat> {
  return [
    {
      key: "repositories",
      url: `https://github.com/${USERNAME}?tab=repositories`,
      title: "Repositories",
      value: user.repositories.totalCount,
      secondaryValue: `(${
        Math.round((user.repositories.totalDiskUsage / 1024 / 1024) * 100) / 100
      } GB)`,
    },
    {
      key: "followers",
      url: `https://github.com/${USERNAME}?tab=followers`,
      title: "Followers",
      value: user.followers.totalCount,
      secondaryValue: `(${user.following.totalCount} following)`,
    },
    {
      key: "watching",
      url: `https://github.com/${USERNAME}?tab=following`,
      title: "Watching",
      value: user.watching.totalCount,
    },
    {
      key: "starredRepositories",
      url: `https://github.com/${USERNAME}?tab=stars`,
      title: "Stars",
      value: user.starredRepositories.totalCount,
    },
    {
      key: "contributions",
      url: `https://github.com/${USERNAME}?tab=overview`,
      title: "Contributions",
      value: user.contributionsCollection.totalCommitContributions,
    },
    {
      key: "issues",
      url: `https://github.com/${USERNAME}?tab=overview`,
      title: "Issues",
      value: user.contributionsCollection.totalIssueContributions,
    },
    {
      key: "pullRequests",
      url: `https://github.com/${USERNAME}?tab=overview`,
      title: "Pull Requests",
      value: user.contributionsCollection.totalPullRequestContributions,
    },
    {
      key: "reviews",
      url: `https://github.com/${USERNAME}?tab=overview`,
      title: "Reviews",
      value: user.contributionsCollection.totalPullRequestReviewContributions,
    },
  ];
}

export function getTopLanguages(user: UserNode): Array<Language> {
  let topLanguages: Array<{
    name: string;
    size: number;
    color: string;
    contrastColor: string;
  }> = [];

  // Loop through the top repositories
  for (const repo of user.repositories.nodes) {
    // Loop through the languages of the repository
    for (const language of repo.languages.edges) {
      // Find the language in the topLanguages array
      const index = topLanguages.findIndex(
        (topLanguage) => topLanguage.name === language.node.name
      );

      // If the language is not in the topLanguages array, add it
      if (index === -1) {
        topLanguages.push({
          name: language.node.name,
          size: language.size,
          color: language.node.color,
          contrastColor: language.node.color
            ? getContrastColor(getRGBColorFromHex(language.node.color))
            : "white",
        });
      } else {
        // If the language is in the topLanguages array, update the size
        topLanguages[index].size += language.size;
      }
    }
  }

  return topLanguages.sort((a, b) => b.size - a.size).slice(0, 12);
}
