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
  PWA: 9,
  Arch: 10,
  Omarchy: 10,
  Hyprland: 10,
  Waybar: 11,
  Herdr: 12,
  OpenCode: 13,
  "Home Assistant": 14,
  Git: 15,
  Stack: 16,
  MCP: 17,
  Automation: 20,
  WebSocket: 21,
  Forecast: 22,
  Lists: 23,
  Notes: 24,
  Calendar: 25,
  Audio: 26,
  Energy: 27,
  Climate: 27,
  Monitoring: 28,
  Navigation: 29,
  Skills: 30,
  Agents: 31,
  Plugins: 32,
  Extension: 32,
  Commands: 33,
  SDK: 34,
  Geolocation: 35,
  Stow: 40,
  "CI/CD": 50,
  "GitHub Actions": 51,
  Linting: 52,
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
