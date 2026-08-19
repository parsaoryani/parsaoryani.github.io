"use client"

import { Nav } from "./nav"
import { Footer } from "./footer"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
