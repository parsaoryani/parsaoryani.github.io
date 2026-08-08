import * as React from "react"
import { cn } from "@/lib/utils/cn"

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border bg-slate-800/50 px-4 py-3 text-sm text-fog placeholder:text-ash/60 transition-all duration-300",
          "border-slate-700/50 focus:border-cyan/50 focus:ring-2 focus:ring-cyan/10 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
