import { cn } from "@/lib/utils/cn"

interface SectionHeaderProps {
  badge?: React.ReactNode
  title: string
  accent?: "cyan" | "indigo" | "emerald"
  description?: string
  className?: string
  action?: React.ReactNode
  spacing?: "default" | "compact"
}

const accentColors = {
  cyan: "from-cyan to-cyan-deep",
  indigo: "from-indigo to-[#7C6CFF]",
  emerald: "from-emerald to-cyan",
}

export function SectionHeader({ badge, title, accent = "cyan", description, className, action, spacing = "default" }: SectionHeaderProps) {
  return (
    <div className={cn(spacing === "compact" ? "mb-8" : "mb-12", className)}>
      {badge && <div className="mb-4">{badge}</div>}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-gradient">{title}</span>
          </h2>
          {description && (
            <p className="text-mist mt-2 text-sm">{description}</p>
          )}
          <div className={cn("mt-3 h-0.5 w-16 bg-gradient-to-r rounded-full", accentColors[accent])} />
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}
