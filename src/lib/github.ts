import { getEnv } from "~/env";
import { getContrastColor, getRGBColorFromHex } from "~/lib/color";
import { type Language } from "~/types/github/language";
import { type UserNode } from "~/types/github/user";

export function getUsername() {
  return getEnv().GITHUB_USERNAME;
}

export function getTopLanguages(user: UserNode): Array<Language> {
  const topLanguages: Array<Language> = [];

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
