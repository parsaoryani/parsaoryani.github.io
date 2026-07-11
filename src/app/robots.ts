import { MetadataRoute } from "next"

const ADMIN_PATH = process.env.ADMIN_PATH || "x7k2-console"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [`/${ADMIN_PATH}`, "/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
