import { ContactForm } from "@/components/content/contact-form"
import { Send } from "lucide-react"

interface ContactSurfaceProps {
  primaryEmail: string
  telegramUrl?: string
}

export function ContactSurface({ primaryEmail: _primaryEmail, telegramUrl: _telegramUrl }: ContactSurfaceProps) {
  void _primaryEmail
  void _telegramUrl

  return (
    <div className="md:col-span-3">
      <div className="p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Send size={16} className="text-cyan" />
          <h2 className="text-lg font-semibold text-gradient">Send a message</h2>
        </div>
        <ContactForm />
      </div>
    </div>
  )
}
