const MASONRY_GAP_PX = 16;

const observers = new WeakMap<HTMLElement, ResizeObserver>();

export function getMasonryColumnCount(width: number): number {
  if (width >= 1280) {
    return 4;
  }

  if (width >= 1024) {
    return 3;
  }

  if (width >= 640) {
    return 2;
  }

  return 1;
}

export function layoutMasonryGrid(
  grid: HTMLElement,
  gap = MASONRY_GAP_PX,
): void {
  const items = [...grid.children].filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );

  if (items.length === 0) {
    grid.style.height = "0px";
    return;
  }

  const columnCount = getMasonryColumnCount(grid.clientWidth);
  const columnWidth =
    (grid.clientWidth - gap * (columnCount - 1)) / columnCount;
  const columnHeights = Array.from({ length: columnCount }, () => 0);

  grid.style.position = "relative";

  for (const item of items) {
    item.style.position = "absolute";
    item.style.width = `${columnWidth}px`;

    let column = 0;
    for (let index = 1; index < columnCount; index++) {
      if (columnHeights[index] < columnHeights[column]) {
        column = index;
      }
    }

    item.style.left = `${column * (columnWidth + gap)}px`;
    item.style.top = `${columnHeights[column]}px`;

    columnHeights[column] += item.offsetHeight + gap;
  }

  const maxHeight = Math.max(...columnHeights);
  grid.style.height = `${maxHeight > 0 ? maxHeight - gap : 0}px`;
}

function observeMasonryGrid(grid: HTMLElement): void {
  if (observers.has(grid)) {
    return;
  }

  const observer = new ResizeObserver(() => {
    layoutMasonryGrid(grid);
  });

  observer.observe(grid);

  for (const child of grid.children) {
    if (child instanceof HTMLElement) {
      observer.observe(child);
    }
  }

  observers.set(grid, observer);
}

export function initMasonryGrids(): void {
  for (const grid of document.querySelectorAll<HTMLElement>(
    "[data-masonry-grid]",
  )) {
    layoutMasonryGrid(grid);
    observeMasonryGrid(grid);
  }
}

export function setupMasonryGrids(): void {
  const run = () => {
    initMasonryGrids();
    document.fonts?.ready.then(initMasonryGrids);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
    return;
  }

  run();
}
