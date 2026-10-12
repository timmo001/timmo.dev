// Content for the GitHub profile README cards served from /github/*.svg.
import { type LinkButtonInput } from "~/lib/cards/links";

export const profile = {
  name: "Aidan Timson",
  handle: "Timmo",
  role: "Home Assistant frontend maintainer at the Open Home Foundation. I build Omarchy and Hyprland desktop tooling, Effect TypeScript CLIs and MCP servers, and bridges between the desktop and the smart home.",
} as const;

export type ReadmeLink = LinkButtonInput & {
  id: string;
  href: string;
};

export const readmeLinks: Array<ReadmeLink> = [
  {
    id: "website",
    label: "timmo.dev",
    href: "https://timmo.dev",
    icon: { kind: "line", name: "globe" },
  },
  {
    id: "sponsor",
    label: "Sponsor",
    href: "https://github.com/sponsors/timmo001",
    icon: { kind: "line", name: "heart" },
  },
  {
    id: "community",
    label: "Community",
    href: "https://community.home-assistant.io/u/timmo001",
    icon: { kind: "brand", name: "homeAssistant" },
  },
  {
    id: "dev",
    label: "DEV",
    href: "https://dev.to/timmo001",
    icon: { kind: "brand", name: "dev" },
  },
  {
    id: "fosstodon",
    label: "Fosstodon",
    href: "https://fosstodon.org/@timmo",
    icon: { kind: "brand", name: "mastodon" },
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aidan-timson",
    icon: { kind: "brand", name: "linkedin" },
  },
];

export function getReadmeLink(id: string): ReadmeLink | undefined {
  return readmeLinks.find((link) => link.id === id);
}

// Project hrefs from src/data/navigation.ts, in display order. Rendered two
// per row, so keep the count even.
export const featuredProjectHrefs: Array<string> = [
  "https://ha-bridge.timmo.dev",
  "https://system-bridge.timmo.dev",
  "https://upnext.timmo.dev",
  "https://triage.timmo.dev",
  "https://context.timmo.dev",
  "https://notes.timmo.dev",
  "https://github.com/timmo001/ha-dashboard-maintenance",
  "https://dotfiles.timmo.dev",
];

export const SOURCE_REPOSITORY = "timmo001/timmo.dev";
