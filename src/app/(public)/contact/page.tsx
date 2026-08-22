import { Container, Section } from "@/components/layout/container"
import { ContactSurface } from "@/components/content/contact-surface"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Mail, Code2, UserCheck, ExternalLink, Sparkles, GraduationCap, MapPin, Send } from "lucide-react"
import { getSiteSettings } from "@/lib/public-data"
import Link from "next/link"
import type { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Parsa Oryani.",
}

const iconMap: Record<string, typeof Mail> = { Mail, Code2, UserCheck, GraduationCap, Send }

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
  const contactLinks = links.some((link) => link.url === "https://t.me/parsaoryanii")
    ? links
    : [{ label: "Telegram", url: "https://t.me/parsaoryanii", desc: "@parsaoryanii", icon: "Send" }, ...links]
  const location = settings.contact_location || { city: "Tehran, Iran", note: "Available for virtual meetings worldwide" }
  const primaryEmail = emails[0]?.address || "parsa.oryani82@sharif.edu"

  const allMethods = [
    ...emails.map((e) => ({ href: `mailto:${e.address}`, label: e.label || "Email", desc: e.address, icon: Mail })),
    ...contactLinks.map((l) => ({ href: l.url, label: l.label, desc: l.desc, icon: iconMap[l.icon || ""] || ExternalLink })),
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

        <div className="max-w-4xl grid md:grid-cols-5 gap-10">
            <ContactSurface primaryEmail={primaryEmail} telegramUrl="https://t.me/parsaoryanii" />

            <div className="md:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-gradient mb-5">Connect</h2>
                <div className="space-y-3">
                  {allMethods.map((method) => (
                    <Link
                      key={method.label}
                      href={method.href}
                      target={method.href.startsWith("http") ? "_blank" : undefined}
                      rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                      className="flex items-center gap-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:border-cyan/20 hover:bg-slate-800/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/10 to-indigo/10 border border-cyan/10 group-hover:border-cyan/30 transition-colors">
                        <method.icon size={16} className="text-cyan" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-fog">{method.label}</p>
                        <p className="text-xs text-ash font-mono truncate">{method.desc}</p>
                      </div>
                      <ExternalLink size={14} className="text-slate-600 group-hover:text-cyan transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-gradient mb-3">Location</h2>
                <div className="flex items-center gap-3 text-mist">
                  <MapPin size={16} className="text-cyan shrink-0" />
                  <span className="text-sm">{location.city}</span>
                </div>
                <p className="text-xs text-ash mt-3 font-mono">{location.note}</p>
              </div>
            </div>
          </div>
      </Container>
    </Section>
  )
}
