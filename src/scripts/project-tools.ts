// The filter-projects WebMCP tool: lets an agent filter /projects by text,
// tags and stack, and read back what's showing. It registers only where the
// browser has `document.modelContext`.
import { z } from "zod";

import { projectFilter, type Filters } from "~/scripts/project-filter";

type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
};

/** What filter-projects takes. Agents can send anything, so it's parsed. */
const FilterInput = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  stack: z.array(z.string()).optional(),
  clear: z.boolean().optional(),
});

/** The arguments an agent sends, before they're parsed. */
type FilterArguments = z.input<typeof FilterInput>;

type ModelContextTool = {
  name: string;
  description: string;
  inputSchema: object;
  execute: (input: FilterArguments) => Promise<ToolResult>;
};

declare global {
  interface Document {
    /** WebMCP's tool registry, where the browser has it. */
    readonly modelContext?: {
      readonly registerTool: (tool: ModelContextTool) => Promise<void> | void;
    };
  }
}

const text = (message: string): ToolResult => ({
  content: [{ type: "text", text: message }],
});

const lower = (values: Array<string> | undefined) =>
  values?.map((value) => value.toLowerCase());

export function registerProjectTools(): void {
  const context = document.modelContext;

  if (context === undefined) {
    return;
  }

  void context.registerTool({
    name: "filter-projects",
    description:
      "Filters the projects on this page by text, tags and stack, and returns the titles of the projects showing. Leave a filter out to keep it as it is, or set clear to start from no filters.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Text to search titles, descriptions, tags and stack.",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags a project must have one of, such as Omarchy.",
        },
        stack: {
          type: "array",
          items: { type: "string" },
          description: "Languages or tools a project must use one of.",
        },
        clear: {
          type: "boolean",
          description: "Clears every filter before applying the others.",
        },
      },
    },
    execute: async (input) => {
      const parsed = FilterInput.safeParse(input);

      if (!parsed.success) {
        return text(
          "Give query as a string, tags and stack as lists of strings, and clear as true or false.",
        );
      }

      const filter = projectFilter();

      if (filter === undefined) {
        return text("The project filters haven't loaded yet.");
      }

      const { query, clear } = parsed.data;
      const tags = lower(parsed.data.tags);
      const stack = lower(parsed.data.stack);
      const options = filter.options();

      const unknown = [
        ...(tags ?? []).filter((tag) => !options.tags.includes(tag)),
        ...(stack ?? []).filter((item) => !options.stack.includes(item)),
      ];

      if (unknown.length > 0) {
        return text(
          `Unknown tags or stack: ${unknown.join(", ")}. Tags: ${options.tags.join(", ")}. Stack: ${options.stack.join(", ")}.`,
        );
      }

      if (clear === true) {
        filter.setFilters({ query: "", tags: new Set(), stack: new Set() });
      }

      const next: Partial<Filters> = {};

      if (query !== undefined) next.query = query;

      if (tags !== undefined) next.tags = new Set(tags);

      if (stack !== undefined) next.stack = new Set(stack);

      filter.setFilters(next);

      const titles = filter.visibleTitles();

      return text(
        titles.length === 0
          ? "No projects match."
          : `${titles.length} showing: ${titles.join(", ")}`,
      );
    },
  });
}
