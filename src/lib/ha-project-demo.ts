import { parse } from "yaml";
import { z } from "zod";

// Home Assistant's embed components, which render dashboard cards against a
// mocked backend in the browser. Served from the dev demo until they reach
// demo.home-assistant.io.
export const HA_EMBED_SCRIPT_URL =
  "https://home-assistant-demo-dev.netlify.app/embed.js";

// The file a project adds to its repository to get a live demo. It is read at
// the latest release tag, so it matches the script of that release.
export const HA_DEMO_FILE = "demo.yaml";

// Home Assistant accepts a date or date and time string, or either in an object
const calendarDateSchema = z.union([
  z.string(),
  z.looseObject({ dateTime: z.string() }),
  z.looseObject({ date: z.string() }),
]);

// The provider data of Home Assistant's embed components: the entities, and
// optionally areas, calendar events and energy preferences.
const haDemoFileSchema = z.object({
  entities: z
    .array(z.looseObject({ entity_id: z.string(), state: z.string() }))
    .default([]),
  areas: z
    .array(z.looseObject({ area_id: z.string(), name: z.string() }))
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
  cards: z.array(z.looseObject({ type: z.string() })).min(1),
});

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
