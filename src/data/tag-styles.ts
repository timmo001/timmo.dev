type TagStyle = {
  backgroundColor: string;
};

const HA_BLUE = "#03A9F4";
const HA_INTEGRATION = "#0277BD";
const HA_CARD = "#29B6F6";
const HA_CARD_FEATURE = "#4FC3F7";
const HA_DASHBOARD = "#039BE5";

const tagStyles: Record<string, TagStyle> = {
  Agents: {
    backgroundColor: "#8b5cf6",
  },
  Archive: {
    backgroundColor: "#64748b",
  },
  Arch: {
    backgroundColor: "#1793d1",
  },
  Automation: {
    backgroundColor: "#c026d3",
  },
  Astro: {
    backgroundColor: "#bc52ee",
  },
  "Bubble Tea": {
    backgroundColor: "#ff75b7",
  },
  Calendar: {
    backgroundColor: "#2563eb",
  },
  Climate: {
    backgroundColor: "#0891b2",
  },
  CLI: {
    backgroundColor: "#52525b",
  },
  Commands: {
    backgroundColor: "#4f46e5",
  },
  Contribution: {
    backgroundColor: "#059669",
  },
  Convex: {
    backgroundColor: "#d97706",
  },
  CSS: {
    backgroundColor: "#1572B6",
  },
  "CI/CD": {
    backgroundColor: "#ea580c",
  },
  Cloudflare: {
    backgroundColor: "#f38020",
  },
  "Desktop App": {
    backgroundColor: "#b45309",
  },
  Effect: {
    backgroundColor: "#be185d",
  },
  Energy: {
    backgroundColor: "#ca8a04",
  },
  Forecast: {
    backgroundColor: "#0284c7",
  },
  Geolocation: {
    backgroundColor: "#059669",
  },
  Git: {
    backgroundColor: "#f05032",
  },
  Go: {
    backgroundColor: "#00758F",
  },
  "GitHub Actions": {
    backgroundColor: "#24292f",
  },
  HACS: {
    backgroundColor: "#6d28d9",
  },
  Herdr: {
    backgroundColor: "#0891b2",
  },
  Hyprland: {
    backgroundColor: "#0891b2",
  },
  JavaScript: {
    backgroundColor: "#c9a227",
  },
  JSON: {
    backgroundColor: "#c4a000",
  },
  JSONC: {
    backgroundColor: "#8b8000",
  },
  MUI: {
    backgroundColor: "#007fff",
  },
  MCP: {
    backgroundColor: "#2563eb",
  },
  "Home Assistant": {
    backgroundColor: HA_BLUE,
  },
  "Home Assistant Card": {
    backgroundColor: HA_CARD,
  },
  "Home Assistant Card Feature": {
    backgroundColor: HA_CARD_FEATURE,
  },
  "Home Assistant Dashboard": {
    backgroundColor: HA_DASHBOARD,
  },
  "Home Assistant Integration": {
    backgroundColor: HA_INTEGRATION,
  },
  Lit: {
    backgroundColor: "#324fff",
  },
  Linting: {
    backgroundColor: "#65a30d",
  },
  Lists: {
    backgroundColor: "#db2777",
  },
  Lua: {
    backgroundColor: "#1e3a8a",
  },
  Markdown: {
    backgroundColor: "#374151",
  },
  Monitoring: {
    backgroundColor: "#0d9488",
  },
  Navigation: {
    backgroundColor: "#4f46e5",
  },
  "Next.js": {
    backgroundColor: "#171717",
  },
  Notes: {
    backgroundColor: "#e11d48",
  },
  OpenTUI: {
    backgroundColor: "#059669",
  },
  Omarchy: {
    backgroundColor: "#7e22ce",
  },
  OpenCode: {
    backgroundColor: "#ea580c",
  },
  Oxlint: {
    backgroundColor: "#d97706",
  },
  Plugins: {
    backgroundColor: "#6366f1",
  },
  Prisma: {
    backgroundColor: "#2d3748",
  },
  PWA: {
    backgroundColor: "#7c3aed",
  },
  Python: {
    backgroundColor: "#3572A5",
  },
  QML: {
    backgroundColor: "#41cd52",
  },
  React: {
    backgroundColor: "#087ea4",
  },
  Skills: {
    backgroundColor: "#9333ea",
  },
  SDK: {
    backgroundColor: "#0284c7",
  },
  Shell: {
    backgroundColor: "#3d7c3f",
  },
  Stack: {
    backgroundColor: "#0f766e",
  },
  Starlight: {
    backgroundColor: "#7c3aed",
  },
  Stow: {
    backgroundColor: "#78716c",
  },
  Tailwind: {
    backgroundColor: "#06b6d4",
  },
  TUI: {
    backgroundColor: "#7c3aed",
  },
  TypeScript: {
    backgroundColor: "#3178c6",
  },
  "Web Components": {
    backgroundColor: "#0d9488",
  },
  Waybar: {
    backgroundColor: "#2563eb",
  },
  YAML: {
    backgroundColor: "#cb171e",
  },
  WebSocket: {
    backgroundColor: "#0f766e",
  },
};

const defaultTagStyle: TagStyle = {
  backgroundColor: "#6366f1",
};

export function getTagStyle(label: string): TagStyle {
  return tagStyles[label] ?? defaultTagStyle;
}
