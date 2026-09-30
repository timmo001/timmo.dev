import { queryElement } from "~/scripts/dom";

function setMobileNavOpen(
  button: HTMLButtonElement,
  panel: HTMLElement,
  open: boolean,
): void {
  button.setAttribute("aria-expanded", String(open));
  button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  panel.hidden = !open;
}

export function initMobileNav(): void {
  const button = queryElement(
    document,
    "[data-mobile-nav-toggle]",
    HTMLButtonElement,
  );

  const panel = queryElement(document, "[data-mobile-nav-panel]", HTMLElement);

  if (!button || !panel) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    setMobileNavOpen(button, panel, !isOpen);
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMobileNavOpen(button, panel, false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setMobileNavOpen(button, panel, false);
    }
  });
}
