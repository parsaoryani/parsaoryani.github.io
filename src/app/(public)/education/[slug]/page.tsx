import { notFound } from "next/navigation"
import { Container, Section } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { getTimelineEvents } from "@/lib/db/queries"
import { CourseDetailCard } from "@/components/content/course-detail-card"
import { slugify } from "@/lib/utils/slugify"
import { GraduationCap, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

async function getEducationEvent(slug: string) {
  const events = await getTimelineEvents()
  return events.find((e) => e.type === "education" && slugify(e.organization) === slug) ?? null
}

export async function generateStaticParams() {
  try {
    const events = await getTimelineEvents()
    return events.filter((e) => e.type === "education").map((e) => ({ slug: slugify(e.organization) }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEducationEvent(slug).catch(() => null)
  if (!event) return {}
  return {
    title: `${event.title} — Coursework`,
    description: `Relevant coursework and syllabi from ${event.organization}.`,
  }
}

function formatDate(date: Date, endDate?: Date | null) {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" }
  const start = date.toLocaleDateString("en-US", options)
  if (!endDate) return `${start} — Present`
  return `${start} — ${endDate.toLocaleDateString("en-US", options)}`
}

export default async function EducationDetailPage({ params }: Props) {
  const { slug } = await params
  const event = await getEducationEvent(slug).catch(() => null)
  if (!event) notFound()

  return (
    <Section className="pt-32">
      <Container>
        <div className="max-w-4xl">
          <Link href="/experience#education" className="inline-flex items-center gap-1.5 text-sm text-mist hover:text-cyan transition-colors mb-8 font-mono">
            <ArrowLeft size={14} /> Back to Experience
          </Link>

          <ScrollReveal>
            <Badge variant="default" size="lg" className="mb-5">
              <GraduationCap size={12} className="mr-1.5" /> Coursework
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-3"><span className="text-gradient">{event.title}</span></h1>
            <p className="text-lg text-mist mb-2">{event.organization}</p>
            <p className="flex items-center gap-1.5 text-sm text-ash font-mono mb-12">
              <Calendar size={13} /> {formatDate(event.startDate, event.endDate)}
            </p>
          </ScrollReveal>

          {event.description && <p className="text-sm text-mist/80 mb-10 max-w-2xl">{event.description}</p>}

          <div className="space-y-4">
            {event.courses.map((course) => (
              <CourseDetailCard key={course.id} course={course} />
            ))}
            {event.courses.length === 0 && (
              <p className="text-sm text-mist/60 font-mono">No coursework has been added for this program yet.</p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
