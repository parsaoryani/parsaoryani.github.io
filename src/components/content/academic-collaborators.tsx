import Image from "next/image"
import { ArrowUpRight, GraduationCap, Mail } from "lucide-react"
import { Section } from "@/components/layout/container"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { SectionHeader } from "@/components/ui/section-header"
import {
  academicCollaborators,
  type AcademicCollaborator,
} from "@/content/academic-collaborators"

function initials(name: string) {
  const parts = name
    .replace(/^(Dr\.|Prof\.)\s+/, "")
    .trim()
    .split(/\s+/)

  return `${parts.at(0)?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`
}

function Portrait({ collaborator }: { collaborator: AcademicCollaborator }) {
  return (
    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-800 shadow-[0_12px_30px_-18px_rgba(31,63,102,0.8)]">
      {collaborator.photoUrl ? (
        <Image
          src={collaborator.photoUrl}
          alt={`${collaborator.name}, ${collaborator.title}`}
          fill
          sizes="96px"
          className="object-cover grayscale-[6%] transition duration-500 group-hover:scale-[1.025] group-hover:grayscale-0"
          style={{ objectPosition: collaborator.photoPosition ?? "50% 28%" }}
        />
      ) : (
        <div
          role="img"
          aria-label={`Portrait placeholder for ${collaborator.name}`}
          className="absolute inset-0 flex items-center justify-center bg-grid-fine"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo/15 via-slate-900/35 to-cyan/10" />
          <span className="relative font-serif text-3xl font-semibold text-indigo/80">
            {initials(collaborator.name)}
          </span>
        </div>
      )}
    </div>
  )
}

function ReferenceCard({ collaborator }: { collaborator: AcademicCollaborator }) {
  return (
    <article
      aria-label={collaborator.name}
      className="group flex h-full flex-col rounded-2xl border border-slate-700/70 bg-slate-900/65 p-5 shadow-[0_18px_48px_-40px_rgba(31,63,102,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo/35 hover:bg-slate-900/80"
    >
      <div className="flex min-w-0 items-start gap-4">
        <Portrait collaborator={collaborator} />
        <div className="min-w-0 pt-1">
          <h3 className="font-serif text-lg font-semibold leading-tight text-fog">
            {collaborator.name}
          </h3>
          <p className="mt-2 text-sm font-medium text-mist">{collaborator.title}</p>
          <div className="mt-1.5 space-y-0.5 text-xs leading-relaxed text-ash">
            {collaborator.affiliation.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-700/60 pt-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-indigo">
          Academic relationship
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-mist">
          {collaborator.relationship}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-5 pt-4">
        <a
          href={collaborator.scholarUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${collaborator.name} on Google Scholar`}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-mist transition-colors hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60"
        >
          <GraduationCap size={13} aria-hidden="true" />
          Scholar
          <ArrowUpRight size={10} aria-hidden="true" />
        </a>
        <a
          href={`mailto:${collaborator.email}`}
          aria-label={`Email ${collaborator.name}`}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-mist transition-colors hover:text-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo/60"
        >
          <Mail size={12} aria-hidden="true" />
          Email
        </a>
      </div>
    </article>
  )
}

export function AcademicCollaborators() {
  return (
    <Section id="academic-collaborations" className="relative py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void via-indigo/[0.025] to-void" />
      <div className="relative mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionHeader
            title="References"
            description="I have had the privilege of working closely with and learning from the following professors throughout my research and studies."
            accent="indigo"
            spacing="compact"
            className="max-w-3xl"
          />
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {academicCollaborators.map((collaborator, index) => (
            <ScrollReveal key={collaborator.name} delay={index * 70} className="h-full">
              <ReferenceCard collaborator={collaborator} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
