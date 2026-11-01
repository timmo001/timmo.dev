import { GwInput, GwSelect } from "@timmo001/groundwork-ui";
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

/** What the projects are filtered by: free text, and tags and stack chosen. */
export type Filters = {
  query: string;
  tags: ReadonlySet<string>;
  stack: ReadonlySet<string>;
};

/** The project filter, once the page has one: its state and its controls. */
export type ProjectFilter = {
  /** The filters in use. */
  readonly state: () => Filters;
  /** Changes some filters, mirrors them in the controls, and filters. */
  readonly setFilters: (next: Partial<Filters>) => void;
  /** Every tag and stack value the pickers offer. */
  readonly options: () => { tags: Array<string>; stack: Array<string> };
  /** The titles of the projects showing. */
  readonly visibleTitles: () => Array<string>;
};

let current: ProjectFilter | undefined;

/** The page's project filter, once `initProjectFilter` has run. */
export function projectFilter(): ProjectFilter | undefined {
  return current;
}

export function initProjectFilter(): void {
  const root = queryElement(document, "[data-project-filters]", HTMLElement);

  if (!root || root.dataset.filterInit === "true") {
    return;
  }

  root.dataset.filterInit = "true";

  const searchInput = queryElement(root, "[data-filter-search]", GwInput);

  const tagSelect = queryElement(root, "[data-filter-picker='tags']", GwSelect);

  const stackSelect = queryElement(
    root,
    "[data-filter-picker='stack']",
    GwSelect,
  );

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

  const state = {
    query: "",
    tags: new Set<string>(),
    stack: new Set<string>(),
  };

  function applyFilters(): void {
    const query = state.query.trim();

    const searchMatches = getSearchMatches(query, entries, fuse);

    for (const entry of entries) {
      const searchPass =
        searchMatches === null || searchMatches.has(entry.element);

      const tagPass = hasIntersection(entry.tags, state.tags);
      const stackPass = hasIntersection(entry.stack, state.stack);
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
      isSearchActive(query) || state.tags.size > 0 || state.stack.size > 0;

    if (emptyState) {
      emptyState.hidden = !(hasActiveFilter && visibleCount === 0);
    }
  }

  // The controls write to the state; setFilters writes to both
  searchInput?.addEventListener("input", () => {
    state.query = searchInput.value;
    applyFilters();
  });

  tagSelect?.addEventListener("change", () => {
    state.tags = new Set(tagSelect.values);
    applyFilters();
  });

  stackSelect?.addEventListener("change", () => {
    state.stack = new Set(stackSelect.values);
    applyFilters();
  });

  // gw-select reads its <option>s into options, then removes them
  const optionValues = (select: GwSelect | null) =>
    select === null ? [] : select.options.map((option) => option.value);

  current = {
    state: () => ({ ...state }),
    setFilters: (next) => {
      if (next.query !== undefined) {
        state.query = next.query;

        if (searchInput) searchInput.value = next.query;
      }

      if (next.tags !== undefined) {
        state.tags = new Set(next.tags);

        if (tagSelect) tagSelect.values = [...state.tags];
      }

      if (next.stack !== undefined) {
        state.stack = new Set(next.stack);

        if (stackSelect) stackSelect.values = [...state.stack];
      }

      applyFilters();
    },
    options: () => ({
      tags: optionValues(tagSelect),
      stack: optionValues(stackSelect),
    }),
    visibleTitles: () =>
      entries.flatMap((entry) =>
        entry.element.style.display === "none" ? [] : [entry.title],
      ),
  };

  applyFilters();
}
