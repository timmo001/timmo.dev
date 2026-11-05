/**
 * Switches a demo between light and dark. The site is dark only, so the mode
 * only applies to the demo's own themed container, and to the Home Assistant
 * embed inside it through its providers' `color-scheme`.
 */

import { GwThemePicker, on } from "@timmo001/groundwork-ui";

import { queryElements } from "~/scripts/dom";

const DEMO_THEME_SELECTOR = "[data-demo-theme]";

// The listeners of the last page, removed when the next page sets up its own
let cleanups: Array<() => void> = [];

function applyMode(
  container: HTMLElement,
  picker: GwThemePicker,
  mode: string,
): void {
  if (mode !== "light" && mode !== "dark") {
    return;
  }

  container.dataset.gwMode = mode;
  picker.setAttribute("mode", mode);

  for (const provider of queryElements(
    container,
    "ha-embed-provider",
    HTMLElement,
  )) {
    provider.setAttribute("color-scheme", mode);
  }
}

export function initDemoTheme(): void {
  for (const cleanup of cleanups) {
    cleanup();
  }

  cleanups = queryElements(document, DEMO_THEME_SELECTOR, HTMLElement).flatMap(
    (container) =>
      queryElements(container, "gw-theme-picker", GwThemePicker).map(
        (picker) =>
          on(picker, "mode", (event) => {
            applyMode(container, picker, event.detail.mode);
          }),
      ),
  );
}
