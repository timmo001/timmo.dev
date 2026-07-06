const DEFAULT_TAG_WEIGHT = 100;

const tagWeights: Record<string, number> = {
  Archive: -1,
  HACS: 0,
  Contribution: 1,
  "Home Assistant Integration": 2,
  "Home Assistant Card": 3,
  "Home Assistant Card Feature": 4,
  "Home Assistant Dashboard": 5,
  "Desktop App": 6,
  CLI: 7,
  TUI: 8,
  Omarchy: 10,
  Waybar: 11,
  OpenCode: 12,
  "Home Assistant": 13,
  Git: 14,
  Stack: 15,
  MCP: 16,
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
