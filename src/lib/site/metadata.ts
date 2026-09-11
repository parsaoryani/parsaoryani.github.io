import type { Metadata } from "next"

export function canonicalPath(pathname: string): NonNullable<Metadata["alternates"]> {
  const withoutQueryOrHash = pathname.split(/[?#]/, 1)[0] ?? ""
  const segments = withoutQueryOrHash.split("/").filter(Boolean)
  return { canonical: segments.length === 0 ? "/" : `/${segments.join("/")}` }
}
