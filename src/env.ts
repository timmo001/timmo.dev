import { env } from "cloudflare:workers";
import { z } from "zod";

const envSchema = z.object({
  GITHUB_TOKEN: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value : undefined)),
  GITHUB_USERNAME: z.string().default("timmo001"),
});

export function getEnv() {
  return envSchema.parse({
    GITHUB_TOKEN: env.GITHUB_TOKEN,
    GITHUB_USERNAME: env.GITHUB_USERNAME,
  });
}
