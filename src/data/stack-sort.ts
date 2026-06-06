const LANGUAGE_SORT_WEIGHT = 0;
const FRAMEWORK_SORT_WEIGHT = 1;

const languageLabels = new Set([
  "Bash",
  "CSS",
  "Go",
  "JavaScript",
  "JSONC",
  "Lua",
  "Python",
  "TypeScript",
  "YAML",
]);

function getStackSortWeight(label: string): number {
  return languageLabels.has(label) ? LANGUAGE_SORT_WEIGHT : FRAMEWORK_SORT_WEIGHT;
}

export function sortStack(items: Array<string>): Array<string> {
  return items.toSorted((a, b) => {
    const weightDiff = getStackSortWeight(a) - getStackSortWeight(b);
    if (weightDiff !== 0) {
      return weightDiff;
    }

    return a.localeCompare(b);
  });
}
