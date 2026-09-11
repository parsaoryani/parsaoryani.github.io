import { describe, expect, it } from "vitest"
import {
  ABOUT_STORY_SECTIONS,
  CURRENT_RESEARCH,
  PRIMARY_RESEARCH_STATEMENT,
  SHORT_TRANSITION,
} from "@/content/research-profile"

describe("research profile content", () => {
  it("states the current research identity directly", () => {
    expect(PRIMARY_RESEARCH_STATEMENT).toContain("security of LLM agents")
    expect(PRIMARY_RESEARCH_STATEMENT).toContain("multi-agent systems")
  })

  it("explains both continuity and the practical research-environment constraint", () => {
    const story = JSON.stringify(ABOUT_STORY_SECTIONS)
    expect(story).toContain("trust")
    expect(story).toContain("authority")
    expect(story).toMatch(/mentorship|collaboration/)
    expect(story).toMatch(/locally|local research environment/)
    expect(story).not.toMatch(/newer frontier|AI research was easier/i)
    expect(story).not.toMatch(/highest grade in both/i)
  })

  it("presents the thesis as work in progress instead of a completed result", () => {
    expect(CURRENT_RESEARCH.status).toBe("In progress")
    expect(CURRENT_RESEARCH.summary).toMatch(/investigates|studies|aims/i)
    expect(CURRENT_RESEARCH.limitations.length).toBeGreaterThan(0)
    expect(CURRENT_RESEARCH.questions.length).toBeGreaterThan(1)
  })

  it("keeps the short transition explicit and bounded", () => {
    expect(SHORT_TRANSITION).toContain("background")
    expect(SHORT_TRANSITION).toContain("AI agents")
  })
})
