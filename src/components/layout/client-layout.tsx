"use client"

import { usePathname } from "next/navigation"
import { Nav } from "./nav"
import { Footer } from "./footer"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
