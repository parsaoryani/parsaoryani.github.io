import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().max(200).optional(),
  body: z.string().min(10, "Message must be at least 10 characters").max(5000),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type LoginData = z.infer<typeof loginSchema>

export const verify2faSchema = z.object({
  token: z.string().length(6),
  sessionToken: z.string(),
})

export const publicationSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(500),
  authors: z.array(z.object({ name: z.string(), isMe: z.boolean().optional() })),
  venue: z.string().min(1),
  venueType: z.enum(["conference", "journal", "workshop", "preprint", "poster", "talk", "thesis"]),
  year: z.number().int().min(1900).max(2100),
  status: z.enum(["draft", "published"]),
  abstract: z.string().optional(),
  tldr: z.string().optional(),
  contributions: z.array(z.string()).optional(),
  doi: z.string().optional(),
  arxivId: z.string().optional(),
  pdfUrl: z.string().optional(),
  codeUrl: z.string().optional(),
  projectUrl: z.string().optional(),
  bibtex: z.string().optional(),
  featured: z.boolean().optional(),
  tagIds: z.array(z.string()).optional(),
})

export const projectSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(500),
  summary: z.string().min(1).max(300),
  role: z.string().optional(),
  status: z.enum(["draft", "published"]),
  year: z.number().int().min(1900).max(2100),
  problem: z.string().optional(),
  approach: z.string().optional(),
  architecture: z.string().optional(),
  challenges: z.string().optional(),
  results: z.string().optional(),
  retrospective: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  repoUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  featured: z.boolean().optional(),
  tagIds: z.array(z.string()).optional(),
})

export const teachingSchema = z.object({
  slug: z.string().min(1).max(200),
  course: z.string().min(1).max(300),
  university: z.string().min(1).max(200),
  professor: z.string().min(1).max(200),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  technologies: z.string().optional(),
  status: z.enum(["draft", "published"]),
})

export const researchingSchema = z.object({
  slug: z.string().min(1).max(200),
  lab: z.string().min(1).max(300),
  university: z.string().min(1).max(200),
  supervisor: z.string().min(1).max(200),
  topic: z.string().min(1).max(500),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  outcomes: z.array(z.string()).optional(),
  technologies: z.string().optional(),
  status: z.enum(["draft", "published"]),
})
