"use client"

import { usePathname } from "next/navigation"
import { Nav } from "./nav"
import { Footer } from "./footer"

export function ClientLayout({ children, adminPath }: { children: React.ReactNode; adminPath: string }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith(`/${adminPath}`)

  if (isAdmin) {
    return <main>{children}</main>
  }

  return (
    <>
      <Nav adminPath={adminPath} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
