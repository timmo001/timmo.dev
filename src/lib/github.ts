import { getEnv } from "~/env";
import { getContrastColor, getRGBColorFromHex } from "~/lib/color";
import { type Language } from "~/types/github/language";
import { type Stat } from "~/types/github/stat";
import { type UserNode } from "~/types/github/user";

export function getUsername() {
  return getEnv().GITHUB_USERNAME;
}

export function getStats(user: UserNode): Array<Stat> {
  const username = getUsername();
  return [
    {
      key: "repositories",
      url: `https://github.com/${username}?tab=repositories`,
      title: "Repositories",
      value: user.repositories.totalCount,
    },
    {
      key: "followers",
      url: `https://github.com/${username}?tab=followers`,
      title: "Followers",
      value: user.followers.totalCount,
      secondaryValue: `(${user.following.totalCount} following)`,
    },
    {
      key: "watching",
      url: `https://github.com/${username}?tab=following`,
      title: "Watching",
      value: user.watching.totalCount,
    },
    {
      key: "starredRepositories",
      url: `https://github.com/${username}?tab=stars`,
      title: "Stars",
      value: user.starredRepositories.totalCount,
    },
  ];
}

export function getTopLanguages(user: UserNode): Array<Language> {
  const topLanguages: Array<{
    name: string;
    size: number;
    color: string;
    contrastColor: string;
  }> = [];

  // Loop through the top repositories
  for (const repo of user.repositories.nodes) {
    // Loop through the languages of the repository
    for (const language of repo.languages?.edges ?? []) {
      // Find the language in the topLanguages array
      const index = topLanguages.findIndex(
        (topLanguage) => topLanguage.name === language.node.name,
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
      } else if (topLanguages[index]) {
        // If the language is in the topLanguages array, update the size
        topLanguages[index].size += language.size;
      }
    }
  }

  return topLanguages.sort((a, b) => b.size - a.size).slice(0, 18);
}
