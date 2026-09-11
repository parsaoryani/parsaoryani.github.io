import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import siteData from "@/content/generated/site-data.json"

const bannedClaims = [
  "Bulletproof-style zk-SNARK",
  "complete POUR protocol",
  "full Zerocash-style mixer",
  "all 18 threat vectors",
  "proved the privacy-compliance trade-off",
  "keeps private keys safe",
  "tests at 99%",
  "pages are complete",
]

describe("published project claims", () => {
  it("does not publish categorical or ambiguous security claims", () => {
    const published = JSON.stringify(siteData.projects)
    for (const claim of bannedClaims) expect(published).not.toContain(claim)
  })

  it("keeps server seed wording aligned with the static snapshot", () => {
    const seed = readFileSync("scripts/seed.ts", "utf8")
    for (const claim of bannedClaims) expect(seed).not.toContain(claim)
  })

  it("labels every case study as a prototype or bounded implementation", () => {
    for (const project of siteData.projects) {
      const copy = `${project.summary} ${project.results} ${project.retrospective}`.toLowerCase()
      expect(copy).toMatch(/prototype|implemented|implementation/)
    }
  })
})
