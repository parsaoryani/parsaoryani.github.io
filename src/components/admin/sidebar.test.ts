import { describe, expect, it } from "vitest"
import { adminNavGroups } from "./sidebar"

describe("admin navigation", () => {
  it("includes one Research Portfolio entry in Content", () => {
    const content = adminNavGroups.find((group) => group.label === "Content")
    expect(content?.items.filter((item) => item.href === "research-portfolio")).toHaveLength(1)
  })
})
