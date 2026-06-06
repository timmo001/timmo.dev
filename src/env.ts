import { z } from "zod";

const envSchema = z.object({
  GITHUB_TOKEN: z.string().min(1),
  GITHUB_USERNAME: z.string().default("timmo001"),
});

export const env = envSchema.parse({
  GITHUB_TOKEN: import.meta.env.GITHUB_TOKEN,
  GITHUB_USERNAME: import.meta.env.GITHUB_USERNAME,
});
