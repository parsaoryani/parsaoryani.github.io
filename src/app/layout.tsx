import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google"
import "@/styles/globals.css"
import { ClientLayout } from "@/components/layout/client-layout"
import { getSiteSetting } from "@/lib/db/queries"
import { NAV_RESEARCH_SETTING_KEY, parseShowResearch } from "@/lib/site/visibility"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4321"
const ADMIN_PATH = process.env.ADMIN_PATH || "x7k2-console"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Parsa Oryani — Secure and Scalable Decentralized Systems",
    template: "%s — Parsa Oryani",
  },
  description:
    "M.Sc. student researching the security and scalability of decentralized systems, blockchain, and Layer-2 protocols. M.Sc. Computer Engineering at Sharif University of Technology.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Parsa Oryani",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "admin-path": ADMIN_PATH,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const showResearch = await getSiteSetting(NAV_RESEARCH_SETTING_KEY)
    .then(parseShowResearch)
    .catch(() => false)

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Parsa Oryani",
              givenName: "Parsa",
              familyName: "Oryani",
              alumniOf: "Sharif University of Technology",
              jobTitle: "M.Sc. Computer Engineering",
              url: siteUrl,
              sameAs: [
                "https://github.com/parsaoryani",
                "https://www.linkedin.com/in/parsa-oryani/",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen font-sans text-fog antialiased" suppressHydrationWarning>
        <ClientLayout showResearch={showResearch}>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
