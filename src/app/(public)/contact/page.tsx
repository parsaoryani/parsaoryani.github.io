import { Container, Section } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Mail, Code2, UserCheck, ExternalLink, Sparkles, GraduationCap, MapPin } from "lucide-react"
import { getSiteSettings } from "@/lib/public-data"
import Link from "next/link"
import type { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Parsa Oryani.",
}

const iconMap: Record<string, typeof Mail> = { Mail, Code2, UserCheck, GraduationCap }

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const description = settings.contact_description?.text || "I am always open to research discussions, collaboration opportunities, and PhD position inquiries. Feel free to reach out."
  const emails = settings.contact_emails.length > 0 ? settings.contact_emails : [
    { label: "Email", address: "parsa.oryani82@sharif.edu" },
    { label: "Email (Personal)", address: "parsa.oryani@gmail.com" },
  ]
  const links = settings.contact_links.length > 0 ? settings.contact_links : [
    { label: "GitHub", url: "https://github.com/parsaoryani", desc: "@parsaoryani", icon: "Code2" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/parsa-oryani/", desc: "in/parsa-oryani", icon: "UserCheck" },
  ]
  const location = settings.contact_location || { city: "Tehran, Iran", note: "Available for virtual meetings worldwide" }

  const allMethods = [
    ...emails.map((e) => ({ href: `mailto:${e.address}`, label: e.label || "Email", desc: e.address, icon: Mail })),
    ...links.map((l) => ({ href: l.url, label: l.label, desc: l.desc, icon: iconMap[l.icon || ""] || ExternalLink })),
  ]

  return (
    <Section className="pt-32">
      <Container>
        <ScrollReveal>
          <div className="max-w-4xl">
            <Badge variant="default" className="mb-5 text-xs px-3 py-1">
              <Sparkles size={12} className="mr-1.5" /> Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Contact</span>
            </h1>
            <p className="text-lg text-mist mb-12 max-w-2xl">{description}</p>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {allMethods.map((method) => (
              <Link
                key={method.label}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex min-h-32 flex-col justify-between rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan/25 hover:bg-slate-800/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/10 bg-gradient-to-br from-cyan/10 to-indigo/10 transition-colors group-hover:border-cyan/30">
                    <method.icon size={17} className="text-cyan" />
                  </div>
                  <ExternalLink size={15} className="shrink-0 text-slate-600 transition-colors group-hover:text-cyan" />
                </div>
                <div className="mt-7 min-w-0">
                  <h2 className="text-sm font-semibold text-fog">{method.label}</h2>
                  <p className="mt-1 truncate font-mono text-xs text-ash">{method.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 backdrop-blur-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gradient">Location</h2>
                <div className="mt-3 flex items-center gap-3 text-mist">
                  <MapPin size={16} className="shrink-0 text-cyan" />
                  <span className="text-sm">{location.city}</span>
                </div>
              </div>
              <p className="font-mono text-xs text-ash sm:text-right">{location.note}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
