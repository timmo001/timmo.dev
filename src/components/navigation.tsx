"use client";

import * as React from "react";
import Link from "next/link";
// import { motion } from "motion/react";

import { cn } from "~/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { ExternalLink } from "lucide-react";

type Link = Array<{
  title: string;
  href: string;
  description: string;
}>;

const projects: Link = [
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

const contributions: Link = [
  {
    title: "Home Assistant Integration | GoXLR Utility",
    href: "https://github.com/timmo001/homeassistant-integration-goxlr-utility",
    description:
      "A third party application from @GoXLR-on-Linux that allows for control of the GoXLR on Linux, Mac and Windows.",
  },
  {
    title: "Home Assistant Integration | System Bridge",
    href: "https://www.home-assistant.io/integrations/system_bridge",
    description:
      "Integrates System Bridge into Home Assistant to control and monitor your desktops via websocket connection.",
  },
  {
    title: "Home Assistant Integration | Azure DevOps",
    href: "https://www.home-assistant.io/integrations/azure_devops",
    description:
      "Allows you to control and monitor your Azure DevOps instance in Home Assistant.",
  },
  {
    title: "Home Assistant Integration | Honeywell Lyric",
    href: "https://www.home-assistant.io/integrations/lyric",
    description:
      "Integrates the Lyric thermostat platform into Home Assistant via the cloud API.",
  },
  {
    title: "Home Assistant Integration | OVO Energy",
    href: "https://www.home-assistant.io/integrations/ovo_energy",
    description:
      "Integrates UK energy provider OVO Energy into Home Assistant to monitor your energy consumption and costs.",
  },
  {
    title: "Home Assistant Community Add-on | The Lounge",
    href: "https://github.com/hassio-addons/addon-thelounge",
    description:
      "A self-hosted web-based IRC client. Part of the Home Assistant Community Add-ons project, original setup by myself.",
  },
];

export function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">About Me</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Software</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-2 lg:w-[700px]">
              {projects.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Contributions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-2 lg:w-[700px]">
              {contributions.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/stats">Stats</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  const isExternal = React.useMemo<boolean>(
    () => props.href?.startsWith("http") ?? false,
    [props.href],
  );

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent/60 hover:text-accent-foreground focus:bg-accent/60 focus:text-accent-foreground block space-y-1 rounded-xl p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className,
          )}
          target={isExternal ? "_blank" : undefined}
          {...props}
        >
          <div className="text-sm leading-none font-medium">
            {title}
            {isExternal && (
              <ExternalLink className="ms-1 mb-1 inline-block h-3 w-3 text-slate-400" />
            )}
          </div>
          <p className="text-muted-foreground line-clamp-3 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
