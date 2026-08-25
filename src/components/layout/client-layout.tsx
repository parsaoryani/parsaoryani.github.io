"use client"

import { ThemeProvider } from "next-themes"
import { Nav } from "./nav"
import { Footer } from "./footer"

export function ClientLayout({ children, showResearch }: { children: React.ReactNode; showResearch: boolean }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Nav showResearch={showResearch} />
      <main>{children}</main>
      <Footer showResearch={showResearch} />
    </ThemeProvider>
  )
}
