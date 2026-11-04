import { env } from "cloudflare:workers";
import { z } from "zod";

const envSchema = z.object({
  GITHUB_TOKEN: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value : undefined)),
  GITHUB_USERNAME: z.string().default("timmo001"),
  // Override for local development against a mock GitHub API.
  GITHUB_API_URL: z
    .url()
    .default("https://api.github.com")
    .transform((value) => value.replace(/\/+$/, "")),
  // Overrides for local development of Home Assistant project demos: the
  // embed script, such as a local build of Home Assistant's demo, and a server
  // of local checkouts, whose `<repo>/demo.yaml` and build of the release
  // script in `<repo>/dist/` replace those of the latest release.
  HA_EMBED_SCRIPT_URL: z.url().optional(),
  HA_DEMO_LOCAL_URL: z
    .url()
    .optional()
    .transform((value) => value?.replace(/\/+$/, "")),
});

export function getEnv() {
  return envSchema.parse({
    GITHUB_TOKEN: env.GITHUB_TOKEN,
    GITHUB_USERNAME: env.GITHUB_USERNAME,
    GITHUB_API_URL: env.GITHUB_API_URL,
    HA_EMBED_SCRIPT_URL: env.HA_EMBED_SCRIPT_URL,
    HA_DEMO_LOCAL_URL: env.HA_DEMO_LOCAL_URL,
  });
}
