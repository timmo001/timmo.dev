/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [{ hostname: "utfs.io" }],
  },
  eslint: {
    // ESLint is disabled during builds to avoid slowing down the build process.
    ignoreDuringBuilds: true,
  },
};

export default config;
