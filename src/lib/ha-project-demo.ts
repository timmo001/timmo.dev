import { parse } from "yaml";
import { z } from "zod";

// Home Assistant's embed components, which render dashboard content against a
// mocked backend in the browser, from demo.home-assistant.io.
// `HA_EMBED_SCRIPT_URL` in the environment replaces it, such as with a local
// build of the demo.
export const HA_EMBED_SCRIPT_URL = "https://demo.home-assistant.io/embed.js";

// The file a project adds to its repository to get a live demo. It is read at
// the latest release tag, so it matches the script of that release.
export const HA_DEMO_FILE = "demo.yaml";

// The script tag of a demo from HA_DEMO_LOCAL_URL, which the script route
// serves from there.
export const LOCAL_DEMO_TAG = "local";

// Home Assistant accepts a date or date and time string, or either in an object
const calendarDateSchema = z.union([
  z.string(),
  z.looseObject({ dateTime: z.string() }),
  z.looseObject({ date: z.string() }),
]);

// A dashboard, view, section or card configuration, checked by Home Assistant
const configSchema = z.looseObject({});

export type HaDemoConfig = z.infer<typeof configSchema>;

// The provider data of Home Assistant's embed components (the entities, and
// optionally areas, devices, calendar events and energy preferences), and the
// dashboard content to render with it: a dashboard with its tabs, views,
// sections and cards, at least one of them.
const haDemoFileSchema = z
  .object({
    entities: z
      .array(z.looseObject({ entity_id: z.string(), state: z.string() }))
      .default([]),
    areas: z
      .array(z.looseObject({ area_id: z.string(), name: z.string() }))
      .optional(),
    devices: z
      .array(z.looseObject({ id: z.string(), name: z.string() }))
      .optional(),
    calendars: z
      .record(
        z.string(),
        z.array(
          z.looseObject({
            summary: z.string(),
            start: calendarDateSchema,
            end: calendarDateSchema,
          }),
        ),
      )
      .optional(),
    energy: z.looseObject({}).optional(),
    // A dashboard's `views` or `strategy`
    dashboard: z
      .union([
        z.looseObject({ views: z.array(configSchema).min(1) }),
        z.looseObject({ strategy: z.looseObject({ type: z.string() }) }),
      ])
      .optional(),
    views: z.array(configSchema).default([]),
    sections: z.array(configSchema).default([]),
    cards: z.array(z.looseObject({ type: z.string() })).default([]),
  })
  .refine(
    ({ dashboard, views, sections, cards }) =>
      dashboard !== undefined ||
      views.length + sections.length + cards.length > 0,
    { message: "Set a dashboard, views, sections or cards" },
  );

type HaDemoFile = z.infer<typeof haDemoFileSchema>;

export type HaProjectDemo = HaDemoFile & {
  pagePath: string;
  script: {
    name: string;
    path: string;
    downloadUrl: string;
  };
};

export function parseHaDemoFile(text: string): HaDemoFile {
  return haDemoFileSchema.parse(parse(text));
}
