import Link from "next/link"
import { Code2, UserCheck, Mail, ExternalLink, GraduationCap, ArrowUpRight } from "lucide-react"

const socialLinks = [
  { href: "https://github.com/parsaoryani", label: "GitHub", icon: Code2 },
  { href: "https://www.linkedin.com/in/parsa-oryani/", label: "LinkedIn", icon: UserCheck },
  { href: "https://scholar.google.com/citations?user=YOUR_ID", label: "Scholar", icon: GraduationCap },
  { href: "mailto:parsa.oryani82@sharif.edu", label: "Email", icon: Mail },
]

export function Footer() {
  return (
    <footer className="relative border-t border-slate-700/50 bg-void">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <Link href="/" className="font-mono text-lg font-semibold bg-gradient-to-r from-cyan to-indigo bg-clip-text text-transparent">
              Parsa Oryani
            </Link>
            <p className="mt-3 text-sm text-mist leading-relaxed max-w-xs">
              PhD applicant researching the security of decentralized and AI systems. M.Sc. Computer Engineering at Sharif University of Technology.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-ash mb-4">Navigation</h3>
            <div className="flex flex-col gap-2">
              {["Research", "Projects", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm text-mist hover:text-cyan transition-colors flex items-center gap-1 group"
                >
                  {item}
                  <ArrowUpRight size={10} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-ash mb-4">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 hover:border-cyan/30 hover:bg-slate-800/80 transition-all duration-300"
                >
                  <link.icon size={14} className="text-mist group-hover:text-cyan transition-colors" />
                  <span className="text-xs text-mist group-hover:text-fog transition-colors">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ash font-mono">
            &copy; {new Date().getFullYear()} Parsa Oryani. Built with Next.js
          </p>
          <p className="text-xs text-ash font-mono">
            Research · Engineering · Security
          </p>
        </div>
      </div>
    </footer>
  )
}
