import Fuse from "fuse.js";

import { queryElement, queryElements } from "~/scripts/dom";

const MIN_SEARCH_LENGTH = 3;

type FilterEntry = {
  element: HTMLElement;
  title: string;
  description: string;
  tags: Array<string>;
  stack: Array<string>;
};

function splitAttr(value: string | null): Array<string> {
  if (!value) {
    return [];
  }

  return value.split("|").filter((part) => part.length > 0);
}

function setVisible(element: HTMLElement, visible: boolean): void {
  element.style.display = visible ? "" : "none";
}

function hasIntersection(
  values: Array<string>,
  selected: Set<string>,
): boolean {
  if (selected.size === 0) {
    return true;
  }

  return values.some((value) => selected.has(value));
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesTokenInText(token: string, text: string): boolean {
  const normalized = token.toLowerCase();
  const haystack = text.toLowerCase();
  const padded = ` ${haystack} `;

  const boundaryPattern = new RegExp(
    `(^|[\\s\\-/])${escapeRegex(normalized)}($|[\\s\\-/]|[^a-z0-9])`,
    "i",
  );

  if (boundaryPattern.test(haystack) || boundaryPattern.test(padded)) {
    return true;
  }

  if (normalized.length < 2) {
    return false;
  }

  const prefixPattern = new RegExp(
    `(^|[\\s\\-/])${escapeRegex(normalized)}[a-z0-9]*`,
    "i",
  );

  return prefixPattern.test(haystack) || prefixPattern.test(padded);
}

function tokenMatchesEntry(
  entry: FilterEntry,
  token: string,
  fuse: Fuse<FilterEntry>,
): boolean {
  const normalized = token.toLowerCase();

  const fields = [
    entry.title,
    entry.description,
    entry.tags.join(" "),
    entry.stack.join(" "),
  ];

  if (fields.some((field) => matchesTokenInText(normalized, field))) {
    return true;
  }

  if (normalized.length < 3) {
    return false;
  }

  return fuse
    .search(normalized)
    .some((result) => result.item.element === entry.element);
}

function titleIncludesToken(title: string, token: string): boolean {
  return matchesTokenInText(token, title);
}

function scoreEntry(entry: FilterEntry, query: string): number {
  const normalizedQuery = query.toLowerCase().trim();

  if (normalizedQuery.length === 0) {
    return 0;
  }

  const title = entry.title.toLowerCase();

  const tokens = normalizedQuery
    .split(/\s+/)
    .filter((token) => token.length > 0);

  if (title === normalizedQuery) {
    return 1000;
  }

  if (title.startsWith(normalizedQuery)) {
    return 900;
  }

  if (title.includes(normalizedQuery)) {
    return 800;
  }

  if (tokens.every((token) => titleIncludesToken(title, token))) {
    return 700;
  }

  let score = 0;

  for (const token of tokens) {
    if (titleIncludesToken(title, token)) {
      score += 50;
      continue;
    }

    if (entry.tags.some((tag) => tag.includes(token))) {
      score += 20;
      continue;
    }

    if (entry.stack.some((item) => item.includes(token))) {
      score += 15;
      continue;
    }

    if (entry.description.toLowerCase().includes(token)) {
      score += 5;
    }
  }

  return score;
}

function getGroupGrid(group: HTMLElement): HTMLElement {
  return queryElement(group, ".stagger-grid", HTMLElement) ?? group;
}

function reorderGroup(
  group: HTMLElement,
  query: string,
  entryByElement: Map<HTMLElement, FilterEntry>,
): void {
  const grid = getGroupGrid(group);

  const cards = queryElements(group, "[data-work-item]", HTMLElement);

  const visible = cards.filter((card) => card.style.display !== "none");
  const hidden = cards.filter((card) => card.style.display === "none");

  visible.sort((left, right) => {
    if (isSearchActive(query)) {
      const leftEntry = entryByElement.get(left);
      const rightEntry = entryByElement.get(right);

      if (leftEntry && rightEntry) {
        const scoreDiff =
          scoreEntry(rightEntry, query) - scoreEntry(leftEntry, query);

        if (scoreDiff !== 0) {
          return scoreDiff;
        }
      }
    }

    return (
      Number(left.dataset.originalOrder ?? 0) -
      Number(right.dataset.originalOrder ?? 0)
    );
  });

  for (const card of [...visible, ...hidden]) {
    grid.appendChild(card);
  }
}

function isSearchActive(query: string): boolean {
  return query.trim().length >= MIN_SEARCH_LENGTH;
}

function getSearchMatches(
  query: string,
  entries: Array<FilterEntry>,
  fuse: Fuse<FilterEntry>,
): Set<HTMLElement> | null {
  if (!isSearchActive(query)) {
    return null;
  }

  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0);

  if (tokens.length === 0) {
    return null;
  }

  return new Set(
    entries.flatMap((entry) =>
      tokens.every((token) => tokenMatchesEntry(entry, token, fuse))
        ? [entry.element]
        : [],
    ),
  );
}

export function initProjectFilter(): void {
  const root = queryElement(document, "[data-project-filters]", HTMLElement);

  if (!root || root.dataset.filterInit === "true") {
    return;
  }

  root.dataset.filterInit = "true";

  const searchInput = queryElement(
    root,
    "[data-filter-search]",
    HTMLInputElement,
  );

  const searchClearButton = queryElement(
    root,
    "[data-filter-search-clear]",
    HTMLButtonElement,
  );

  const tagButtons = queryElements(
    root,
    "[data-filter-tag]",
    HTMLButtonElement,
  );

  const stackButtons = queryElements(
    root,
    "[data-filter-stack]",
    HTMLButtonElement,
  );

  const pickers = queryElements(root, "[data-picker]", HTMLElement);

  const cards = queryElements(document, "[data-work-item]", HTMLElement);

  const groups = queryElements(document, "[data-filter-group]", HTMLElement);

  const sections = queryElements(
    document,
    "[data-filter-section]",
    HTMLElement,
  );

  const emptyState = queryElement(document, "[data-filter-empty]", HTMLElement);

  const entries: Array<FilterEntry> = cards.map((element) => ({
    element,
    title: element.dataset.title ?? "",
    description: element.dataset.description ?? "",
    tags: splitAttr(element.dataset.tags ?? null),
    stack: splitAttr(element.dataset.stack ?? null),
  }));

  const entryByElement = new Map(
    entries.map((entry) => [entry.element, entry]),
  );

  for (const group of groups) {
    queryElements(group, "[data-work-item]", HTMLElement).forEach(
      (card, index) => {
        card.dataset.originalOrder = String(index);
      },
    );
  }

  const fuse = new Fuse(entries, {
    includeScore: false,
    threshold: 0.2,
    distance: 30,
    minMatchCharLength: 2,
    ignoreLocation: true,
    keys: [
      { name: "title", weight: 3 },
      { name: "tags", weight: 2 },
      { name: "stack", weight: 1.5 },
      { name: "description", weight: 1 },
    ],
  });

  const selectedTags = new Set<string>();
  const selectedStack = new Set<string>();

  function updatePickerCounts(): void {
    for (const picker of pickers) {
      const count = picker.querySelectorAll('[aria-pressed="true"]').length;

      const badge = queryElement(picker, "[data-picker-count]", HTMLElement);

      if (badge) {
        badge.textContent = String(count);
        badge.classList.toggle("hidden", count === 0);
        badge.classList.toggle("inline-flex", count > 0);
      }
    }
  }

  function updateClearButtons(): void {
    const hasSearchText = (searchInput?.value.length ?? 0) > 0;
    searchClearButton?.classList.toggle("hidden", !hasSearchText);

    for (const picker of pickers) {
      const clearButton = queryElement(
        picker,
        "[data-picker-clear]",
        HTMLButtonElement,
      );

      const count = picker.querySelectorAll('[aria-pressed="true"]').length;
      clearButton?.classList.toggle("hidden", count === 0);
    }
  }

  function applyFilters(): void {
    const query = searchInput?.value.trim() ?? "";

    const searchMatches = getSearchMatches(query, entries, fuse);

    for (const entry of entries) {
      const searchPass =
        searchMatches === null || searchMatches.has(entry.element);

      const tagPass = hasIntersection(entry.tags, selectedTags);
      const stackPass = hasIntersection(entry.stack, selectedStack);
      setVisible(entry.element, searchPass && tagPass && stackPass);
    }

    for (const group of groups) {
      reorderGroup(group, query, entryByElement);
    }

    let visibleCount = 0;

    for (const group of groups) {
      const groupVisible = queryElements(
        group,
        "[data-work-item]",
        HTMLElement,
      ).some((card) => card.style.display !== "none");

      setVisible(group, groupVisible);

      if (groupVisible) {
        visibleCount += 1;
      }
    }

    for (const section of sections) {
      const sectionVisible = queryElements(
        section,
        "[data-filter-group]",
        HTMLElement,
      ).some((group) => group.style.display !== "none");

      setVisible(section, sectionVisible);
    }

    const hasActiveFilter =
      isSearchActive(query) || selectedTags.size > 0 || selectedStack.size > 0;

    if (emptyState) {
      setVisible(emptyState, hasActiveFilter && visibleCount === 0);
    }

    updateClearButtons();
    updatePickerCounts();
  }

  function clearPickerSelection(pickerKey: string): void {
    const isTagPicker = pickerKey === "tag";
    const buttons = isTagPicker ? tagButtons : stackButtons;
    const selected = isTagPicker ? selectedTags : selectedStack;

    selected.clear();

    for (const button of buttons) {
      button.setAttribute("aria-pressed", "false");
    }

    applyFilters();
  }

  function toggleSelection(
    button: HTMLButtonElement,
    value: string,
    selected: Set<string>,
  ): void {
    if (selected.has(value)) {
      selected.delete(value);
      button.setAttribute("aria-pressed", "false");
    } else {
      selected.add(value);
      button.setAttribute("aria-pressed", "true");
    }

    applyFilters();
  }

  function setPickerOpen(picker: HTMLElement, open: boolean): void {
    const trigger = queryElement(
      picker,
      "[data-picker-trigger]",
      HTMLButtonElement,
    );

    const panel = queryElement(picker, "[data-picker-panel]", HTMLElement);
    trigger?.setAttribute("aria-expanded", String(open));
    panel?.classList.toggle("hidden", !open);
    panel?.classList.toggle("flex", open);
  }

  function closeAllPickers(except?: HTMLElement): void {
    for (const picker of pickers) {
      if (picker === except) {
        continue;
      }

      setPickerOpen(picker, false);
    }
  }

  for (const picker of pickers) {
    const pickerKey = picker.dataset.picker ?? "";

    const clearButton = queryElement(
      picker,
      "[data-picker-clear]",
      HTMLButtonElement,
    );

    const trigger = queryElement(
      picker,
      "[data-picker-trigger]",
      HTMLButtonElement,
    );

    const pickerSearch = queryElement(
      picker,
      "[data-picker-search]",
      HTMLInputElement,
    );

    const options = queryElements(picker, "[data-picker-option]", HTMLElement);

    trigger?.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      closeAllPickers(picker);
      const nextOpen = !isOpen;
      setPickerOpen(picker, nextOpen);

      if (nextOpen) {
        pickerSearch?.focus();
      }
    });

    pickerSearch?.addEventListener("input", () => {
      const query = pickerSearch.value.trim().toLowerCase();

      for (const option of options) {
        const label = option.dataset.label ?? "";
        setVisible(option, query.length === 0 || label.includes(query));
      }
    });

    clearButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      clearPickerSelection(pickerKey);
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (target instanceof Node && !root.contains(target)) {
      closeAllPickers();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllPickers();
    }
  });

  searchInput?.addEventListener("input", applyFilters);

  searchClearButton?.addEventListener("click", (event) => {
    event.stopPropagation();

    if (searchInput) {
      searchInput.value = "";
    }

    applyFilters();
  });

  for (const button of tagButtons) {
    const value = button.dataset.filterTag ?? "";
    button.addEventListener("click", () =>
      toggleSelection(button, value, selectedTags),
    );
  }

  for (const button of stackButtons) {
    const value = button.dataset.filterStack ?? "";
    button.addEventListener("click", () =>
      toggleSelection(button, value, selectedStack),
    );
  }

  applyFilters();
}
