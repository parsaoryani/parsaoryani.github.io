import { describe, expect, it } from "vitest"
import { canonicalPath } from "@/lib/site/metadata"

describe("canonicalPath", () => {
  it("keeps the home route canonical", () => {
    expect(canonicalPath("/")).toEqual({ canonical: "/" })
  })

  it("normalizes leading and trailing slashes", () => {
    expect(canonicalPath("about/")).toEqual({ canonical: "/about" })
    expect(canonicalPath("//projects/zk-private-payments//")).toEqual({
      canonical: "/projects/zk-private-payments",
    })
  })

  it("drops query strings and fragments from canonical URLs", () => {
    expect(canonicalPath("/research/?draft=true#work")).toEqual({ canonical: "/research" })
  })
})
