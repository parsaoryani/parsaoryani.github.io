import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface StaticContactSurfaceProps {
  primaryEmail: string
}

export function ContactSurface({ primaryEmail }: StaticContactSurfaceProps) {
  return (
    <div className="md:col-span-3">
      <div className="p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Mail size={16} className="text-cyan" />
          <h2 className="text-lg font-semibold text-gradient">Email</h2>
        </div>
        <p className="text-sm text-mist mb-6">
          The static site uses direct email and social links instead of storing messages.
        </p>
        <a href={`mailto:${primaryEmail}`}>
          <Button variant="default" size="lg" className="font-mono text-xs gap-2">
            <Mail size={14} /> Email me
          </Button>
        </a>
      </div>
    </div>
  )
}
