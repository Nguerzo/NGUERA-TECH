import type { MetadataRoute } from "next";
import { SITE_URL, LOCALIZED_PATHS, ROUTE_KEYS } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTE_KEYS.flatMap((key) => {
    const paths = LOCALIZED_PATHS[key];
    const alternates = {
      languages: {
        "en-GB": `${SITE_URL}${paths.en}`,
        fr: `${SITE_URL}${paths.fr}`,
      },
    };
    return [
      { url: `${SITE_URL}${paths.en}`, alternates, changeFrequency: "weekly" as const, priority: key === "/" ? 1 : 0.7 },
      { url: `${SITE_URL}${paths.fr}`, alternates, changeFrequency: "weekly" as const, priority: key === "/" ? 1 : 0.7 },
    ];
  });
}
