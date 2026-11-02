/**
 * Loads Home Assistant's embed and each card's script for lazy card demos
 * (`HaCardDemo` with `lazy`) only when the demo nears the viewport, so a page
 * with several demos doesn't fetch and render them all up front.
 */

import { queryElements } from "~/scripts/dom";

const LAZY_DEMO_SELECTOR = "ha-embed-provider[data-embed-src]";

// Start loading a little before the demo scrolls into view.
const ROOT_MARGIN = "400px 0px";

// Each script once per page, however many demos share it. The scripts only
// define custom elements, so their exports aren't needed.
const loadedScripts = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  const existing = loadedScripts.get(src);

  if (existing) {
    return existing;
  }

  const loading = import(/* @vite-ignore */ src).then(() => undefined);

  loadedScripts.set(src, loading);

  return loading;
}

// The embed defines the elements the card script builds on, so it goes first.
async function loadDemo(provider: HTMLElement): Promise<void> {
  const { embedSrc, cardSrc } = provider.dataset;

  if (!embedSrc || !cardSrc) {
    return;
  }

  try {
    await loadScript(embedSrc);
    await loadScript(cardSrc);
  } catch (error) {
    console.error("Loading a card demo failed", error);
  }
}

let observer: IntersectionObserver | undefined;

export function initLazyHaDemos(): void {
  observer?.disconnect();

  const providers = queryElements(document, LAZY_DEMO_SELECTOR, HTMLElement);

  if (providers.length === 0) {
    return;
  }

  observer = new IntersectionObserver(
    (entries, current) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) {
          continue;
        }

        current.unobserve(entry.target);
        void loadDemo(entry.target);
      }
    },
    { rootMargin: ROOT_MARGIN },
  );

  for (const provider of providers) {
    observer.observe(provider);
  }
}
