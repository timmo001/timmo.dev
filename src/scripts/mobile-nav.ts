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
  const button = document.querySelector<HTMLButtonElement>(
    "[data-mobile-nav-toggle]",
  );
  const panel = document.querySelector<HTMLElement>("[data-mobile-nav-panel]");

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
