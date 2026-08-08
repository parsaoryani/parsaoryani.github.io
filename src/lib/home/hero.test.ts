import { describe, expect, it } from "vitest"
import {
  HOME_SETTING_KEYS,
  DEFAULT_TITLE_LINES,
  DEFAULT_DESCRIPTION,
  parseHomeTitle,
  parseHomeDescription,
} from "@/lib/home/hero"

describe("HOME_SETTING_KEYS", () => {
  it("covers the home hero keys", () => {
    expect(HOME_SETTING_KEYS).toEqual(["home_title", "home_description"])
  })
})

describe("parseHomeTitle", () => {
  it("splits a multi-line value into trimmed lines", () => {
    expect(parseHomeTitle("First line\n  Second line  \nThird")).toEqual(["First line", "Second line", "Third"])
  })

  it("skips empty lines", () => {
    expect(parseHomeTitle("\n\nOnly line\n\n")).toEqual(["Only line"])
  })

  it("falls back to defaults when the value is not a string", () => {
    expect(parseHomeTitle(null)).toEqual(DEFAULT_TITLE_LINES)
    expect(parseHomeTitle(42)).toEqual(DEFAULT_TITLE_LINES)
    expect(parseHomeTitle(undefined)).toEqual(DEFAULT_TITLE_LINES)
  })

  it("falls back to defaults when the value is empty or blank", () => {
    expect(parseHomeTitle("")).toEqual(DEFAULT_TITLE_LINES)
    expect(parseHomeTitle("   ")).toEqual(DEFAULT_TITLE_LINES)
    expect(parseHomeTitle("\n\n")).toEqual(DEFAULT_TITLE_LINES)
  })
})

describe("parseHomeDescription", () => {
  it("trims surrounding whitespace", () => {
    expect(parseHomeDescription("  hello world  ")).toBe("hello world")
  })

  it("falls back to the default when the value is not a string", () => {
    expect(parseHomeDescription(null)).toBe(DEFAULT_DESCRIPTION)
    expect(parseHomeDescription(undefined)).toBe(DEFAULT_DESCRIPTION)
    expect(parseHomeDescription(false)).toBe(DEFAULT_DESCRIPTION)
  })

  it("falls back to the default when the value is empty or blank", () => {
    expect(parseHomeDescription("")).toBe(DEFAULT_DESCRIPTION)
    expect(parseHomeDescription("   ")).toBe(DEFAULT_DESCRIPTION)
  })
})