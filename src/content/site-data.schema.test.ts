import { describe, expect, it } from "vitest"
import assetManifest from "./generated/asset-manifest.json"
import siteData from "./generated/site-data.json"
import {
  parseStaticAssetManifest,
  parseStaticSiteData,
  staticSettingsSchema,
  staticSiteDataSchema,
} from "./site-data.schema"

describe("static site data contract", () => {
  it("accepts the committed empty generated snapshot", () => {
    expect(parseStaticSiteData(siteData).schemaVersion).toBe(1)
    expect(parseStaticAssetManifest(assetManifest).schemaVersion).toBe(1)
  })

  it("rejects unknown settings so arbitrary SiteSetting keys cannot become public", () => {
    expect(() =>
      staticSettingsSchema.parse({
        ...siteData.settings,
        private_admin_note: "do not publish",
      })
    ).toThrow()
  })

  it("rejects private model fields and operational metadata", () => {
    expect(() =>
      staticSiteDataSchema.parse({
        ...siteData,
        users: [{ email: "owner@example.com" }],
      })
    ).toThrow()

    expect(() =>
      staticSiteDataSchema.parse({
        ...siteData,
        publications: [
          {
            id: "pub-1",
            slug: "pub-1",
            title: "Publication",
            authors: [{ name: "Parsa", isMe: true }],
            venue: "Venue",
            venueType: "conference",
            year: 2026,
            publishedAt: "2026-08-22T00:00:00.000Z",
            abstract: null,
            tldr: null,
            contributions: [],
            doi: null,
            arxivId: null,
            pdfUrl: null,
            codeUrl: null,
            projectUrl: null,
            bibtex: null,
            citationCount: null,
            featured: false,
            sortOrder: 0,
            ogImageUrl: null,
            tags: [],
            deletedAt: null,
          },
        ],
      })
    ).toThrow()
  })

  it("accepts the current renderer JSON shapes", () => {
    expect(
      staticSiteDataSchema.parse({
        ...siteData,
        publications: [
          {
            id: "pub-1",
            slug: "pub-1",
            title: "Publication",
            authors: [{ name: "Parsa", isMe: true }],
            venue: "Venue",
            venueType: "conference",
            year: 2026,
            publishedAt: "2026-08-22T00:00:00.000Z",
            abstract: null,
            tldr: null,
            contributions: ["Built the prototype", { text: "Validated the protocol" }],
            doi: null,
            arxivId: null,
            pdfUrl: "/generated/media/ab/file.pdf",
            codeUrl: "https://github.com/parsaoryani/example",
            projectUrl: null,
            bibtex: null,
            citationCount: null,
            featured: true,
            sortOrder: 0,
            ogImageUrl: null,
            tags: [],
          },
        ],
        projects: [
          {
            id: "project-1",
            slug: "project-1",
            title: "Project",
            summary: "Summary",
            role: null,
            year: 2026,
            problem: null,
            approach: null,
            architecture: null,
            challenges: null,
            results: null,
            retrospective: null,
            techStack: ["TypeScript", "Zod"],
            repoUrl: null,
            demoUrl: null,
            featured: false,
            sortOrder: 0,
            ogImageUrl: null,
            tags: [],
          },
        ],
        timelineEvents: [
          {
            id: "event-1",
            type: "education",
            title: "M.Sc.",
            organization: "Sharif University of Technology",
            location: null,
            startDate: "2026-08-22T00:00:00.000Z",
            endDate: null,
            description: null,
            highlights: ["Secure computing"],
            url: null,
            sortOrder: 0,
            courses: [],
          },
        ],
        teachingAssistants: [
          {
            id: "ta-1",
            slug: "ta-1",
            course: "Cryptography",
            level: "graduate",
            university: "Sharif University of Technology",
            professor: "Professor",
            startDate: "2026-08-22T00:00:00.000Z",
            endDate: null,
            description: null,
            highlights: ["Held office hours"],
            technologies: "Python, Cryptography",
            sortOrder: 0,
          },
        ],
        researchingAssistants: [
          {
            id: "ra-1",
            slug: "ra-1",
            lab: null,
            university: "Sharif University of Technology",
            supervisor: null,
            supervisorUrl: null,
            collaborator: null,
            topic: "Blockchain security",
            startDate: "2026-08-22T00:00:00.000Z",
            endDate: null,
            description: null,
            outcomes: ["Built an evaluation harness"],
            technologies: "Rust, TypeScript",
            repoUrl: null,
            sortOrder: 0,
          },
        ],
      }).schemaVersion
    ).toBe(1)
  })

  it("accepts public research agenda and proposal records without admin metadata", () => {
    const parsed = staticSiteDataSchema.parse({
      ...siteData,
      researchAgenda: {
        id: "primary",
        headline: "Secure and Trustworthy Agentic AI",
        summary: "A focused agenda for safer tool-using agents.",
        themes: ["Agent security"],
        description: null,
        documentUrl: null,
        updatedAt: "2026-10-28T00:00:00.000Z",
      },
      researchProposals: [
        {
          id: "proposal-1",
          slug: "secure-agent-memory",
          title: "Secure Agent Memory",
          kind: "research_proposal",
          stage: "in_preparation",
          year: 2026,
          versionLabel: "v0.1",
          summary: "A proposal about protecting persistent agent memory.",
          themes: ["Agent security"],
          motivation: null,
          researchQuestion: null,
          approach: null,
          expectedContributions: null,
          limitations: null,
          pdfUrl: "/research/proposals/secure-agent-memory-v0.1.pdf",
          featured: true,
          sortOrder: 0,
          updatedAt: "2026-10-28T00:00:00.000Z",
        },
      ],
    })

    expect(parsed.researchProposals[0]?.versionLabel).toBe("v0.1")
    expect(parsed.researchAgenda?.headline).toContain("Agentic AI")
  })
})
