import * as React from "react"
import { cn } from "@/lib/utils/cn"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { glow?: boolean }>(
  ({ className, glow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group relative rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm transition-all duration-500",
        glow
          ? "hover:border-cyan/20 hover:shadow-[0_0_30px_-10px_rgba(56,225,196,0.15)]"
          : "hover:border-slate-600/50",
        className
      )}
      {...props}
    >
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-cyan/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      <div className="relative z-10">{props.children}</div>
    </div>
  )
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
