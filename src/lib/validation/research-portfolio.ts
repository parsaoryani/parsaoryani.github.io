import { z } from "zod"

const emptyToNull = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? null : value

const optionalText = z.preprocess(emptyToNull, z.string().trim().max(10_000).nullable().optional())
const optionalPublicUrl = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .refine((value) => value.startsWith("/") || URL.canParse(value), "Enter a valid URL")
    .nullable()
    .optional()
)

export const proposalKindLabels = {
  thesis_proposal: "Thesis Proposal",
  research_proposal: "Research Proposal",
  concept_note: "Concept Note",
} as const

export const proposalStageLabels = {
  in_preparation: "In preparation",
  active: "Active",
  archived: "Archived",
} as const

export const researchAgendaSchema = z
  .object({
    headline: z.string().trim().min(1).max(300),
    summary: z.string().trim().min(1).max(2_000),
    themes: z.array(z.string().trim().min(1).max(100)).max(12),
    description: optionalText,
    documentUrl: optionalPublicUrl,
    status: z.enum(["draft", "published"]),
    version: z.number().int().min(1),
  })
  .strict()

export const researchProposalSchema = z
  .object({
    slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().trim().min(1).max(500),
    kind: z.enum(["thesis_proposal", "research_proposal", "concept_note"]),
    stage: z.enum(["in_preparation", "active", "archived"]),
    year: z.number().int().min(1900).max(2100),
    versionLabel: z.string().trim().min(1).max(50),
    summary: z.string().trim().min(1).max(2_000),
    themes: z.array(z.string().trim().min(1).max(100)).max(12),
    motivation: optionalText,
    researchQuestion: optionalText,
    approach: optionalText,
    expectedContributions: optionalText,
    limitations: optionalText,
    pdfUrl: optionalPublicUrl,
    status: z.enum(["draft", "published"]),
    featured: z.boolean(),
    sortOrder: z.number().int(),
    version: z.number().int().min(1),
  })
  .strict()

export type ResearchAgendaInput = z.infer<typeof researchAgendaSchema>
export type ResearchProposalInput = z.infer<typeof researchProposalSchema>
