export type NavItem = {
  title: string;
  href: string;
  description: string;
  tags?: Array<string>;
};

export const projects: Array<NavItem> = [
  {
    title: "System Bridge",
    href: "https://system-bridge.timmo.dev",
    description:
      "A desktop application for controlling and monitoring your desktops.",
  },
  {
    title: "Home Assistant Assist Desktop",
    description:
      "Use Home Assistant Assist on the desktop. Compatible with Windows, MacOS, and Linux.",
    href: "https://github.com/timmo001/home-assistant-assist-desktop",
  },
  {
    title: "LetMeKnow",
    href: "https://github.com/timmo001/letmeknow",
    description:
      "A server and client application for sending notifications via websockets using Home Assistant or your own service.",
  },
  {
    title: "Home Panel",
    href: "https://github.com/timmo001/home-panel",
    description:
      "A web frontend for controlling the home. Integrates with Home Assistant as an additional frontend.",
  },
  {
    title: "Developer Utilities",
    href: "https://github.com/timmo001/developer-utilities-webapp",
    description:
      "A webapp provides a collection of utilities for developers such as Base64 encoding, JSON formatting, JWT decoding, and more.",
  },
  {
    title: "Stats Webapp",
    href: "https://github.com/timmo001/stats.timmo.dev",
    description:
      "A small portal to display metrics, built with Next.js and deployed with Vercel.",
  },
  {
    title: "GitHub Workflows (Actions)",
    href: "https://github.com/timmo001/workflows",
    description:
      "A set of reusable workflows for GitHub Actions. I use these in my own CI/CD pipelines shared across projects.",
  },
];

export const contributions: Array<NavItem> = [
  {
    title: "GoXLR Utility",
    tags: ["Home Assistant Integration"],
    href: "https://github.com/timmo001/homeassistant-integration-goxlr-utility",
    description:
      "A third party application from @GoXLR-on-Linux that allows for control of the GoXLR on Linux, Mac and Windows.",
  },
  {
    title: "System Bridge",
    tags: ["Home Assistant Integration"],
    href: "https://www.home-assistant.io/integrations/system_bridge",
    description:
      "Integrates System Bridge into Home Assistant to control and monitor your desktops via websocket connection.",
  },
  {
    title: "Azure DevOps",
    tags: ["Home Assistant Integration"],
    href: "https://www.home-assistant.io/integrations/azure_devops",
    description:
      "Allows you to control and monitor your Azure DevOps instance in Home Assistant.",
  },
  {
    title: "Honeywell Lyric",
    tags: ["Home Assistant Integration"],
    href: "https://www.home-assistant.io/integrations/lyric",
    description:
      "Integrates the Lyric thermostat platform into Home Assistant via the cloud API.",
  },
  {
    title: "OVO Energy",
    tags: ["Home Assistant Integration"],
    href: "https://www.home-assistant.io/integrations/ovo_energy",
    description:
      "Integrates UK energy provider OVO Energy into Home Assistant to monitor your energy consumption and costs.",
  },
  {
    title: "The Lounge",
    tags: ["Home Assistant Community Add-on"],
    href: "https://github.com/hassio-addons/addon-thelounge",
    description:
      "A self-hosted web-based IRC client. Part of the Home Assistant Community Add-ons project, original setup by myself.",
  },
];
