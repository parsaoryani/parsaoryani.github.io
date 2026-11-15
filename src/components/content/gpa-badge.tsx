import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/cn"

/**
 * Displays a degree's GPA: the original scale (e.g. 18.26/20) plus the
 * converted scale (e.g. 4.00/4.00) when one is recorded.
 */
export function GpaBadge({
  gpa,
  gpaConverted,
  className,
}: {
  gpa?: string | null
  gpaConverted?: string | null
  className?: string
}) {
  const primary = gpa?.trim() || null
  const converted = gpaConverted?.trim() || null
  if (!primary && !converted) return null

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-2", className)}>
      {primary && (
        <Badge variant="default" size="sm" className="gap-1">
          <span className="opacity-70">GPA</span>
          <span className="font-semibold">{primary}</span>
        </Badge>
      )}
      {converted && (
        <span className="font-mono text-xs text-ash">
          &asymp; {converted} <span className="text-mist/50">(converted)</span>
        </span>
      )}
    </span>
  )
}
