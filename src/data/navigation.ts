export type NavItem = {
  title: string;
  href: string;
  description: string;
  tags?: Array<string>;
  stack?: Array<string>;
};

export const projects: Array<NavItem> = [
  {
    title: "Dotfiles",
    tags: ["TUI", "CLI", "OpenCode", "Omarchy", "Stow"],
    stack: ["TypeScript", "Bash", "Python", "Lua", "Bun", "Effect", "OpenTUI"],
    href: "https://github.com/timmo001/dotfiles",
    description:
      "Public Arch/Omarchy dotfiles with GNU Stow and a compiled dot CLI. Machine bootstrap, multi-repo git tooling, GitHub workflow and notification inboxes, Omarchy desktop sync, optional private overlays, and OpenCode agent publishing.",
  },
  {
    title: "OpenCode Config",
    tags: ["Skills", "Agents", "Plugins", "Commands"],
    stack: ["TypeScript", "Bun"],
    href: "https://github.com/timmo001/opencode-config",
    description:
      "Shared OpenCode skills, agents, plugins, and commands, published from dotfiles for standalone browsing and install. Branch-context workflows, permission-scoped agents, refactor commands, env protection, and skills for TypeScript, codebase diagnostics, and Home Assistant frontend work.",
  },
  {
    title: "Waybar Config",
    tags: ["Omarchy", "Waybar", "Home Assistant"],
    stack: ["JSONC", "CSS"],
    href: "https://github.com/timmo001/omarchy-waybar",
    description:
      "Waybar config for Omarchy with desktop and laptop layouts. Custom modules surface git notifications, workflow runs, and diff status via the dot CLI, and Home Assistant entity watches through go-automate's bridge for heating, doorbell, air quality, rain, and more.",
  },
  {
    title: "Go Automate",
    tags: ["TUI", "CLI", "Home Assistant", "Automation", "WebSocket"],
    stack: ["Go", "TypeScript", "Bun", "Effect", "OpenTUI"],
    href: "https://github.com/timmo001/go-automate",
    description:
      "A utility to run common tasks: keyboard shortcuts and patched apps on Linux to trigger Home Assistant automations. A local Unix socket bridge multiplexes one Home Assistant WebSocket connection for entity watches and status-bar scripts, shipped as a systemd user service with Arch packaging.",
  },
  {
    title: "System Bridge",
    tags: ["TUI", "CLI", "Desktop App", "Home Assistant", "WebSocket"],
    stack: ["Go", "TypeScript", "Bun", "Lit", "Effect", "OpenTUI", "Vite"],
    href: "https://system-bridge.timmo.dev",
    description:
      "A bridge for your systems: a cross-platform app for Linux and Windows that exposes system information and control via an API and WebSocket server. Integrates with Home Assistant for monitoring desktops and sending commands.",
  },
  {
    title: "GitHub Workflows",
    tags: ["CI/CD", "GitHub Actions"],
    stack: ["YAML"],
    href: "https://github.com/timmo001/workflows",
    description:
      "GitHub Actions workflows shared between my projects, including linting, testing, CodeQL, container and language builds, Home Assistant card validation, Dependabot and Renovate automerge, release drafting, and more. Open for reuse and contribution.",
  },
  {
    title: "Weather",
    tags: ["Forecast"],
    stack: ["TypeScript", "Next.js", "React", "Tailwind"],
    href: "https://weather.timmo.dev",
    description:
      "A progressive web app for current conditions and forecasts powered by Tomorrow.io. Set your location via coordinates or browser geolocation, browse hourly and daily outlooks across five days, and switch between dark and light themes.",
  },
  {
    title: "Pouch",
    tags: ["Archive", "Lists", "Notes"],
    stack: ["TypeScript", "Next.js", "React", "Convex", "Tailwind"],
    href: "https://pouch.timmo.dev",
    description:
      "Store your favorite things: a web app for organizing lists and notepads into groups with drag-and-drop reordering and real-time sync across devices. Built with Next.js, Convex, and Clerk authentication.",
  },
  {
    title: "Home Panel",
    tags: ["Archive", "Home Assistant", "WebSocket"],
    stack: ["TypeScript", "Next.js", "React", "MUI", "Prisma"],
    href: "https://github.com/timmo001/home-panel",
    description:
      "A web frontend for controlling the home, integrated with Home Assistant as an additional frontend. Archived and no longer maintained. Home Assistant dashboards surpassed what it offered.",
  },
  {
    title: "Go Commands",
    tags: ["Archive", "CLI", "Home Assistant", "MQTT"],
    stack: ["Go"],
    href: "https://github.com/timmo001/go-commands",
    description:
      "Run commands on your machine via MQTT and Home Assistant. Trigger shell commands remotely from automations or other integrations.",
  },
  {
    title: "Home Assistant TUI",
    tags: ["TUI", "CLI", "Home Assistant"],
    stack: ["TypeScript", "Bun", "Effect", "OpenTUI"],
    href: "https://github.com/timmo001/home-assistant-tui",
    description:
      "A terminal UI for Home Assistant built with OpenTUI and Effect. Browse entities by domain and area, search with fuzzy matching, and view favorites from your Home Assistant frontend config.",
  },
  {
    title: "Dashboard Maintenance",
    tags: ["HACS", "Home Assistant Dashboard"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-dashboard-maintenance",
    description:
      "A dashboard for keeping on top of your home: low batteries, repairs, updates, offline devices, and stale sensors. Overview at a glance with room-by-room views, and a summary tile you can add elsewhere.",
  },
  {
    title: "Calendar Agenda",
    tags: ["HACS", "Home Assistant Card"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-calendar-agenda",
    description:
      "Shows upcoming calendar events in a simple list. Pick one or more calendars, choose how far ahead to look, and optionally collapse duplicate events across calendars.",
  },
  {
    title: "Energy Breakdown",
    tags: ["HACS", "Home Assistant Card"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-energy-breakdown",
    description:
      "Shows what is using power right now, broken down by room and device. Browse from a whole-home view down to individual entities, with current usage and today's total.",
  },
  {
    title: "Tile Popup",
    tags: ["HACS", "Home Assistant Card"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-tile-popup",
    description:
      "A tile on your dashboard that opens a panel with more cards inside. Useful for hiding controls or extra detail behind a single tap.",
  },
  {
    title: "Anchor",
    tags: ["HACS", "Home Assistant Card"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-anchor",
    description:
      "Lets you link to a specific place on a long dashboard. Open a URL with an anchor to jump straight to the section you want.",
  },
  {
    title: "Weather Forecast",
    tags: ["HACS", "Home Assistant Card Feature"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-feature-weather-forecast",
    description:
      "Adds a forecast strip to tile cards for weather entities. Choose how many periods to show and whether temperatures are rounded.",
  },
  {
    title: "State",
    tags: ["HACS", "Home Assistant Card Feature"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-feature-state",
    description:
      "Shows an entity's state on a tile card, including attributes or extra details like area name. Adjustable text size in the editor.",
  },
];

export const contributions: Array<NavItem> = [
  {
    title: "Home Assistant Frontend",
    tags: ["Contribution", "Home Assistant"],
    stack: ["TypeScript", "Lit", "Web Components"],
    href: "https://github.com/home-assistant/frontend",
    description:
      "I am one of the core maintainers of the Home Assistant frontend for the Open Home Foundation.",
  },
  {
    title: "System Bridge",
    tags: ["Contribution", "Home Assistant Integration"],
    stack: ["Python"],
    href: "https://www.home-assistant.io/integrations/system_bridge",
    description:
      "Core integration for System Bridge with local push via Zeroconf, binary sensors, media players, notify, sensors, and update platforms. Monitor system data and send commands such as opening URLs or sending keypresses.",
  },
  {
    title: "Honeywell Lyric",
    tags: ["Contribution", "Home Assistant Integration"],
    stack: ["Python"],
    href: "https://www.home-assistant.io/integrations/lyric",
    description:
      "Connects Honeywell Lyric thermostats via the cloud API. Climate control, select entities, and sensors through config flow and DHCP discovery.",
  },
  {
    title: "GoXLR Utility",
    tags: ["Archive", "Home Assistant Integration", "HACS"],
    stack: ["Python"],
    href: "https://github.com/timmo001/homeassistant-integration-goxlr-utility",
    description:
      "Connects GoXLR Utility, the third-party app from @GoXLR-on-Linux for controlling the GoXLR. Binary sensors, media players with volume control, and profile sensors. Does not connect to the official GoXLR application. I no longer use it.",
  },
  {
    title: "OVO Energy",
    tags: ["Contribution", "Home Assistant Integration"],
    stack: ["Python"],
    href: "https://www.home-assistant.io/integrations/ovo_energy",
    description:
      "Monitors OVO Energy accounts in the UK via config flow, with sensors for electricity and gas consumption, costs, and latest meter readings.",
  },
  {
    title: "Azure DevOps",
    tags: ["Contribution", "Home Assistant Integration"],
    stack: ["Python"],
    href: "https://www.home-assistant.io/integrations/azure_devops",
    description:
      "Cloud polling via config flow with sensors for latest builds, work items by type and state, and other project activity from your Azure DevOps instance.",
  },
  {
    title: "GitHub",
    tags: ["Contribution", "Home Assistant Integration"],
    stack: ["Python"],
    href: "https://www.home-assistant.io/integrations/github",
    description:
      "OAuth-backed monitoring for repositories you own or have starred. Sensors for latest commits, issues, pull requests, releases, tags, and diagnostics such as stars, forks, and open discussions, updated from repository events.",
  },
];
