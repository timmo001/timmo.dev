import { type MetadataRoute } from "next";

export const baseUrl = "https://timmo.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/stats`,
      lastModified: new Date(),
    },
  ];
}
