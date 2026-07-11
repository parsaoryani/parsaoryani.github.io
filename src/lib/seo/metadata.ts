import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Parsa Oryani — Researcher in Blockchain & AI Security",
    template: "%s — Parsa Oryani",
  },
  description:
    "PhD applicant researching the security of decentralized and AI systems. M.Sc. Computer Engineering at Sharif University of Technology.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Parsa Oryani",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export function createPageMetadata(overrides: Partial<Metadata>): Metadata {
  return {
    ...baseMetadata,
    ...overrides,
  }
}
