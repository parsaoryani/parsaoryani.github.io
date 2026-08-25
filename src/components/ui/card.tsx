import * as React from "react"
import { cn } from "@/lib/utils/cn"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { glow?: boolean; glowColor?: "cyan" | "indigo" | "emerald" }>(
  ({ className, glow, glowColor = "cyan", ...props }, ref) => {
    const glowShadows = {
      cyan: "hover:border-cyan/20 hover:shadow-[0_0_30px_-10px_color-mix(in_srgb,var(--accent-primary)_15%,transparent)]",
      indigo: "hover:border-indigo/20 hover:shadow-[0_0_30px_-10px_color-mix(in_srgb,var(--accent-secondary)_15%,transparent)]",
      emerald: "hover:border-emerald/20 hover:shadow-[0_0_30px_-10px_color-mix(in_srgb,var(--semantic-success)_15%,transparent)]",
    }
    const glowGradients = {
      cyan: "from-cyan/[0.03] to-transparent",
      indigo: "from-indigo/[0.03] to-transparent",
      emerald: "from-emerald/[0.03] to-transparent",
    }
    return (
      <div
        ref={ref}
        className={cn(
          "group relative rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm transition-all duration-500",
          "hover:-translate-y-0.5 hover:shadow-xl",
          glow
            ? glowShadows[glowColor]
            : "hover:border-slate-600/50",
          className
        )}
        {...props}
      >
        {glow && (
          <div className={cn(
            "absolute inset-0 rounded-xl bg-gradient-to-b to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
            glowGradients[glowColor]
          )} />
        )}
        <div className="relative z-10">{props.children}</div>
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardContent }
