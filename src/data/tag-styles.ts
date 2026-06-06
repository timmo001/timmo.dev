export type TagStyle = {
  backgroundColor: string;
};

const HOME_ASSISTANT_BLUE = "#03A9F4";
const HACS_PURPLE = "#41BDF5";
const INDIGO = "#6366f1";

export const tagStyles: Record<string, TagStyle> = {
  Agents: {
    backgroundColor: INDIGO,
  },
  Archived: {
    backgroundColor: "#64748b",
  },
  Automation: {
    backgroundColor: INDIGO,
  },
  CLI: {
    backgroundColor: INDIGO,
  },
  Commands: {
    backgroundColor: INDIGO,
  },
  "CI/CD": {
    backgroundColor: INDIGO,
  },
  "Desktop App": {
    backgroundColor: INDIGO,
  },
  Forecast: {
    backgroundColor: INDIGO,
  },
  "GitHub Actions": {
    backgroundColor: "#24292f",
  },
  HACS: {
    backgroundColor: HACS_PURPLE,
  },
  "Home Assistant": {
    backgroundColor: HOME_ASSISTANT_BLUE,
  },
  "Home Assistant Card": {
    backgroundColor: HOME_ASSISTANT_BLUE,
  },
  "Home Assistant Card Feature": {
    backgroundColor: HOME_ASSISTANT_BLUE,
  },
  "Home Assistant Dashboard": {
    backgroundColor: HOME_ASSISTANT_BLUE,
  },
  "Home Assistant Integration": {
    backgroundColor: HOME_ASSISTANT_BLUE,
  },
  Lists: {
    backgroundColor: INDIGO,
  },
  Notes: {
    backgroundColor: INDIGO,
  },
  Omarchy: {
    backgroundColor: INDIGO,
  },
  OpenCode: {
    backgroundColor: INDIGO,
  },
  Plugins: {
    backgroundColor: INDIGO,
  },
  Skills: {
    backgroundColor: INDIGO,
  },
  Stow: {
    backgroundColor: INDIGO,
  },
  TUI: {
    backgroundColor: "#7c3aed",
  },
  Waybar: {
    backgroundColor: INDIGO,
  },
  "Web App": {
    backgroundColor: INDIGO,
  },
  WebSocket: {
    backgroundColor: INDIGO,
  },
};

const defaultTagStyle: TagStyle = {
  backgroundColor: INDIGO,
};

export function getTagStyle(label: string): TagStyle {
  return tagStyles[label] ?? defaultTagStyle;
}
