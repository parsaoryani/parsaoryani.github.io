import { Button } from "@/components/ui/button"
import { Mail, Send } from "lucide-react"

interface StaticContactSurfaceProps {
  primaryEmail: string
  telegramUrl?: string
}

export function ContactSurface({ primaryEmail, telegramUrl = "https://t.me/parsaoryanii" }: StaticContactSurfaceProps) {
  return (
    <div className="md:col-span-3">
      <div className="relative overflow-hidden p-6 rounded-2xl border border-cyan/15 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-800/30 backdrop-blur-sm">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Send size={16} className="text-cyan" />
            <h2 className="text-lg font-semibold text-gradient">Start a conversation</h2>
          </div>
          <p className="text-sm leading-6 text-mist mb-6">
            Reach out for research discussions, collaboration ideas, or academic opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`mailto:${primaryEmail}`} className="sm:w-auto">
              <Button variant="default" size="lg" className="w-full font-mono text-xs gap-2">
                <Mail size={14} /> Email
              </Button>
            </a>
            <a href={telegramUrl} target="_blank" rel="noreferrer" className="sm:w-auto">
              <Button variant="outline" size="lg" className="w-full font-mono text-xs gap-2">
                <Send size={14} /> Telegram
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
