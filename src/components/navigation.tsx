"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "~/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { ExternalLink } from "lucide-react";

type Link = Array<{
  title: string;
  href: string;
  description: string;
}>;

const software: Link = [
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
    title: "Stats WebApp",
    href: "https://github.com/timmo001/stats.timmo.dev",
    description:
      "A small portal to display metrics, built with Next.js and deployed with Vercel.",
  },
  {
    title: "GitHub Workflows (Actions)",
    href: "https://github.com/timmo001/workflows",
    description:
      "A set of reusable workflows for GitHub Actions. I use these in my own CI/CD pipelines.",
  },
];

export function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Software</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {software.map((component) => (
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
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  const isExternal = React.useMemo<boolean>(
    () => props.href?.startsWith("http") || false,
    [props.href],
  );

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/80 hover:text-accent-foreground focus:bg-accent/80 focus:text-accent-foreground",
            className,
          )}
          target={isExternal ? "_blank" : undefined}
          {...props}
        >
          <div className="text-sm font-medium leading-none">
            {title}
            {isExternal && (
              <ExternalLink className="mb-1 ms-1 inline-block h-3 w-3 text-slate-400" />
            )}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
