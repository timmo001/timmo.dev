export type TagStyle = {
  backgroundColor: string;
};

const HA_BLUE = "#03A9F4";
const HA_INTEGRATION = "#0277BD";
const HA_CARD = "#29B6F6";
const HA_CARD_FEATURE = "#4FC3F7";
const HA_DASHBOARD = "#039BE5";

export const tagStyles: Record<string, TagStyle> = {
  Agents: {
    backgroundColor: "#8b5cf6",
  },
  Archive: {
    backgroundColor: "#64748b",
  },
  Automation: {
    backgroundColor: "#c026d3",
  },
  Bash: {
    backgroundColor: "#3d7c3f",
  },
  Bun: {
    backgroundColor: "#3b3b3b",
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
  "Desktop App": {
    backgroundColor: "#b45309",
  },
  Effect: {
    backgroundColor: "#be185d",
  },
  Forecast: {
    backgroundColor: "#0284c7",
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
  JavaScript: {
    backgroundColor: "#c9a227",
  },
  JSONC: {
    backgroundColor: "#8b8000",
  },
  MUI: {
    backgroundColor: "#007fff",
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
  Lists: {
    backgroundColor: "#db2777",
  },
  Lua: {
    backgroundColor: "#1e3a8a",
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
  Plugins: {
    backgroundColor: "#6366f1",
  },
  Prisma: {
    backgroundColor: "#2d3748",
  },
  Python: {
    backgroundColor: "#3572A5",
  },
  React: {
    backgroundColor: "#087ea4",
  },
  Skills: {
    backgroundColor: "#9333ea",
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
  Vite: {
    backgroundColor: "#646cff",
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
