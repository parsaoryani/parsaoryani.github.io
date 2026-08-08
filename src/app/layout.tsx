import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google"
import "@/styles/globals.css"
import { ClientLayout } from "@/components/layout/client-layout"

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

export const metadata: Metadata = {
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

const ADMIN_PATH = process.env.ADMIN_PATH || "x7k2-console"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
                "https://scholar.google.com/citations?user=YOUR_ID",
                "https://www.linkedin.com/in/parsa-oryani/",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen font-sans text-fog antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
