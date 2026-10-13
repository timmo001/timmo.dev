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
});

export function getEnv() {
  return envSchema.parse({
    GITHUB_TOKEN: env.GITHUB_TOKEN,
    GITHUB_USERNAME: env.GITHUB_USERNAME,
    GITHUB_API_URL: env.GITHUB_API_URL,
  });
}
