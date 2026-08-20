import { describe, expect, it } from "vitest"
import { getAvailableProjectTags } from "./available-project-tags"

const tagAt = <Tag>(tags: Tag[], index: number) => {
  const tag = tags[index]
  if (!tag) throw new Error(`Missing test tag at index ${index}`)
  return tag
}

describe("getAvailableProjectTags", () => {
  it("returns only tags attached to the current projects", () => {
    const allTags = [
      { id: "tag-ai", slug: "ai-security", label: "AI Security", color: null },
      { id: "tag-blockchain", slug: "blockchain", label: "Blockchain", color: null },
      { id: "tag-zk", slug: "zk", label: "Zero-Knowledge", color: null },
      { id: "tag-formal", slug: "formal-verification", label: "Formal Verification", color: null },
    ]

    const projects = [
      {
        id: "project-zk-mixer",
        tags: [
          { tagId: "tag-zk", tag: tagAt(allTags, 2) },
          { tagId: "tag-blockchain", tag: tagAt(allTags, 1) },
        ],
      },
      {
        id: "project-ethereum-cli",
        tags: [
          { tagId: "tag-blockchain", tag: tagAt(allTags, 1) },
        ],
      },
    ]

    expect(getAvailableProjectTags(projects, allTags)).toEqual([
      tagAt(allTags, 1),
      tagAt(allTags, 2),
    ])
  })

  it("deduplicates repeated project tags and preserves global tag ordering", () => {
    const allTags = [
      { id: "tag-crypto", slug: "cryptography", label: "Cryptography", color: null },
      { id: "tag-ethereum", slug: "ethereum", label: "Ethereum", color: null },
      { id: "tag-zk", slug: "zk", label: "Zero-Knowledge", color: null },
    ]

    const projects = [
      {
        id: "project-one",
        tags: [
          { tagId: "tag-zk", tag: tagAt(allTags, 2) },
          { tagId: "tag-ethereum", tag: tagAt(allTags, 1) },
        ],
      },
      {
        id: "project-two",
        tags: [
          { tagId: "tag-zk", tag: tagAt(allTags, 2) },
        ],
      },
    ]

    expect(getAvailableProjectTags(projects, allTags)).toEqual([
      tagAt(allTags, 1),
      tagAt(allTags, 2),
    ])
  })
})
