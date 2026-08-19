import type { NextConfig } from "next"

const isProd = process.env.NODE_ENV === "production"

const nextConfig: NextConfig = {
  output: "standalone",
  // Keep Turbopack rooted at this application when a parent workspace has another lockfile.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  redirects: async () => [
    { source: "/research-assistance", destination: "/experience#research-assistance", permanent: true },
    { source: "/teaching", destination: "/experience#teaching-assistance", permanent: true },
  ],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' blob: data: https:",
            "font-src 'self'",
            "connect-src 'self' https:",
            "frame-ancestors 'none'",
          ].join("; "),
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
        },
        ...(isProd
          ? [
              {
                key: "Strict-Transport-Security",
                value: "max-age=63072000; includeSubDomains; preload",
              },
              {
                key: "X-XSS-Protection",
                value: "1; mode=block",
              },
            ]
          : []),
      ],
    },
  ],
}

export default nextConfig
