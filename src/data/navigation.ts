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
      "Stow-managed Arch/Omarchy dotfiles rooted at ~/.config/dotfiles. Includes the dot CLI (Bun, Effect, OpenTUI) with a TUI dashboard for git, GitHub workflow runs, notifications, omarchy menus, and AI commit suggestions. Optional private overlays and Omarchy repo sync for Hyprland, Waybar, and Ghostty.",
  },
  {
    title: "OpenCode Config",
    tags: ["Skills", "Agents", "Plugins", "Commands"],
    stack: ["TypeScript", "Bun"],
    href: "https://github.com/timmo001/opencode-config",
    description:
      "Shared OpenCode skills, agents, plugins, and commands. Published automatically from dotfiles via a GitHub Actions workflow when OpenCode config or skills change.",
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
      "A custom Home Assistant dashboard and view strategy for maintenance dashboards. Surfaces battery-powered devices that need attention and links through to device pages.",
  },
  {
    title: "Calendar Agenda",
    tags: ["HACS", "Home Assistant Card"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-calendar-agenda",
    description:
      "A custom Home Assistant card for displaying calendar events in a simple agenda view.",
  },
  {
    title: "Energy Breakdown",
    tags: ["HACS", "Home Assistant Card"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-energy-breakdown",
    description:
      "A custom Home Assistant card for visualizing current energy usage with a breakdown by area and entity.",
  },
  {
    title: "Tile Popup",
    tags: ["HACS", "Home Assistant Card"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-tile-popup",
    description:
      "A custom Home Assistant card that displays a tile which opens a popup containing other cards.",
  },
  {
    title: "Anchor",
    tags: ["HACS", "Home Assistant Card"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-anchor",
    description:
      "A custom Home Assistant card to create a link to an area of your dashboard.",
  },
  {
    title: "Weather Forecast",
    tags: ["HACS", "Home Assistant Card Feature"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-feature-weather-forecast",
    description:
      "A card feature to show weather forecast on compatible Home Assistant cards.",
  },
  {
    title: "State",
    tags: ["HACS", "Home Assistant Card Feature"],
    stack: ["TypeScript", "Lit"],
    href: "https://github.com/timmo001/ha-card-feature-state",
    description:
      "A custom Home Assistant card feature for displaying entity state on compatible cards.",
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
      "The core Home Assistant integration for System Bridge with local push via Zeroconf, binary sensors, media players, notify, sensors, and update platforms. Monitor system data and send commands such as opening URLs or sending keypresses.",
  },
  {
    title: "Honeywell Lyric",
    tags: ["Contribution", "Home Assistant Integration"],
    stack: ["Python"],
    href: "https://www.home-assistant.io/integrations/lyric",
    description:
      "Integrates Honeywell Lyric thermostats into Home Assistant via the cloud API. Supports climate control, select entities, and sensors through config flow and DHCP discovery.",
  },
  {
    title: "GoXLR Utility",
    tags: ["Home Assistant Integration", "HACS"],
    stack: ["Python"],
    href: "https://github.com/timmo001/homeassistant-integration-goxlr-utility",
    description:
      "A HACS integration for GoXLR Utility, the third-party app from @GoXLR-on-Linux for controlling the GoXLR on Linux, macOS, and Windows. Exposes binary sensors, media players with volume control, and profile sensors. Does not connect to the official GoXLR application.",
  },
  {
    title: "OVO Energy",
    tags: ["Contribution", "Home Assistant Integration"],
    stack: ["Python"],
    href: "https://www.home-assistant.io/integrations/ovo_energy",
    description:
      "Monitors UK OVO Energy consumption and billing data in Home Assistant. Config flow setup with sensors for energy usage, costs, and account information.",
  },
  {
    title: "Azure DevOps",
    tags: ["Contribution", "Home Assistant Integration"],
    stack: ["Python"],
    href: "https://www.home-assistant.io/integrations/azure_devops",
    description:
      "Cloud polling integration for Azure DevOps with config flow setup. Provides sensors for latest builds, work items per type and state, and other project activity so you can monitor your instance from Home Assistant.",
  },
];
