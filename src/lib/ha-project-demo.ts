import { parse } from "yaml";
import { z } from "zod";

// Home Assistant's embed components, which render dashboard cards against a
// mocked backend in the browser.
export const HA_EMBED_SCRIPT_URL = "https://demo.home-assistant.io/embed.js";

// The file a project adds to its repository to get a live demo. It is read at
// the latest release tag, so it matches the script of that release.
export const HA_DEMO_FILE = "demo.yaml";

// The provider data of Home Assistant's embed components: the entities, and
// optionally areas, calendar events and energy preferences.
const haDemoFileSchema = z.object({
  entities: z.array(z.looseObject({ entity_id: z.string() })).default([]),
  areas: z
    .array(z.looseObject({ area_id: z.string(), name: z.string() }))
    .optional(),
  calendars: z.record(z.string(), z.array(z.looseObject({}))).optional(),
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
