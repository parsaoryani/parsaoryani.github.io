import { prisma } from "@/lib/db/prisma"

export interface Profile {
  name: string
  email: string
  personalEmail: string
  university: string
  role: string
  department: string
  bio: string
  linkedinUrl: string
  githubUrl: string
  scholarUrl: string
  scholarId: string
}

export interface PageContent {
  homepage: {
    heroTitle: string
    heroSubtitle: string
    heroDescription: string
    researchDescription: string
    availabilityText: string
    venueText: string
  }
  about: {
    biography: string
    focusDescription: string
    offeringDescription: string
  }
  cv: {
    subtitle: string
  }
}

const DEFAULT_PROFILE: Profile = {
  name: "Parsa Oryani",
  email: "parsa.oryani82@sharif.edu",
  personalEmail: "parsa.oryani@gmail.com",
  university: "Sharif University of Technology",
  role: "PhD applicant",
  department: "Computer Engineering",
  bio: "PhD applicant researching the security of decentralized and AI systems. M.Sc. Computer Engineering at Sharif University of Technology.",
  linkedinUrl: "https://www.linkedin.com/in/parsa-oryani/",
  githubUrl: "https://github.com/parsaoryani",
  scholarUrl: "https://scholar.google.com/citations?user=YOUR_ID",
  scholarId: "YOUR_ID",
}

const DEFAULT_PAGE_CONTENT: PageContent = {
  homepage: {
    heroTitle: "Parsa Oryani",
    heroSubtitle: "M.Sc. Computer Engineering — Sharif University of Technology",
    heroDescription: "Researching the security of decentralized systems and AI-assisted formal verification.",
    researchDescription: "I research the security of decentralized systems and AI-assisted formal verification, with publications in top venues on topics ranging from ZK-rollup security to adversarial robustness in agentic AI.",
    availabilityText: "Open to PhD opportunities in security, formal verification, and trustworthy AI.",
    venueText: "Publications in IEEE S&P, NDSS, and leading AI safety workshops.",
  },
  about: {
    biography: "I am a Master's student in Computer Engineering at Sharif University of Technology, researching the intersection of blockchain security, formal verification, and AI safety.",
    focusDescription: "My research focuses on developing provably secure protocols for decentralized systems and verifying the safety of AI-assisted decision-making.",
    offeringDescription: "I bring expertise in formal methods, cryptographic protocol analysis, and machine learning robustness testing.",
  },
  cv: {
    subtitle: "M.Sc. Computer Engineering · Blockchain & AI Security Researcher",
  },
}

export async function getProfile(): Promise<Profile> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "profile" } })
    if (setting?.value) {
      return { ...DEFAULT_PROFILE, ...(setting.value as Record<string, unknown>) as Partial<Profile> }
    }
  } catch {
    // Fall back to defaults
  }
  return DEFAULT_PROFILE
}

export async function getPageContent(): Promise<PageContent> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "pageContent" } })
    if (setting?.value) {
      const content = setting.value as Record<string, unknown>
      return {
        homepage: { ...DEFAULT_PAGE_CONTENT.homepage, ...(content.homepage as Record<string, string> || {}) },
        about: { ...DEFAULT_PAGE_CONTENT.about, ...(content.about as Record<string, string> || {}) },
        cv: { ...DEFAULT_PAGE_CONTENT.cv, ...(content.cv as Record<string, string> || {}) },
      }
    }
  } catch {
    // Fall back to defaults
  }
  return DEFAULT_PAGE_CONTENT
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const current = await getProfile()
  const updated = { ...current, ...data }
  await prisma.siteSetting.upsert({
    where: { key: "profile" },
    create: { key: "profile", value: updated },
    update: { value: updated },
  })
  return updated
}

export async function updatePageContent(data: Partial<PageContent>): Promise<PageContent> {
  const current = await getPageContent()
  const updated = {
    homepage: { ...current.homepage, ...(data.homepage || {}) },
    about: { ...current.about, ...(data.about || {}) },
    cv: { ...current.cv, ...(data.cv || {}) },
  }
  await prisma.siteSetting.upsert({
    where: { key: "pageContent" },
    create: { key: "pageContent", value: updated },
    update: { value: updated },
  })
  return updated
}