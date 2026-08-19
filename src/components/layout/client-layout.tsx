"use client"

import { Nav } from "./nav"
import { Footer } from "./footer"

export function ClientLayout({ children, showResearch }: { children: React.ReactNode; showResearch: boolean }) {
  return (
    <>
      <Nav showResearch={showResearch} />
      <main>{children}</main>
      <Footer showResearch={showResearch} />
    </>
  )
}
