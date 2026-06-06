const DEFAULT_TAG_WEIGHT = 100;

const tagWeights: Record<string, number> = {
  HACS: 0,
  "Home Assistant Integration": 1,
  "Home Assistant Card": 2,
  "Home Assistant Card Feature": 3,
  "Home Assistant Dashboard": 4,
  "Desktop App": 5,
  TUI: 7,
  CLI: 8,
  Omarchy: 10,
  Waybar: 11,
  OpenCode: 12,
  "Home Assistant": 13,
  Automation: 20,
  WebSocket: 21,
  Forecast: 22,
  Lists: 23,
  Notes: 24,
  Skills: 30,
  Agents: 31,
  Plugins: 32,
  Commands: 33,
  Stow: 40,
  "CI/CD": 50,
  "GitHub Actions": 51,
  "Web App": 55,
  Archived: 60,
};

function getTagSortWeight(label: string): number {
  return tagWeights[label] ?? DEFAULT_TAG_WEIGHT;
}

export function sortTags(items: Array<string>): Array<string> {
  return items.toSorted((a, b) => {
    const weightDiff = getTagSortWeight(a) - getTagSortWeight(b);
    if (weightDiff !== 0) {
      return weightDiff;
    }

    return a.localeCompare(b);
  });
}
