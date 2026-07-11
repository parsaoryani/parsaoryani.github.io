import { cn } from "@/lib/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-medium font-mono transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-cyan/10 text-cyan border border-cyan/20",
        secondary: "bg-indigo/10 text-indigo border border-indigo/20",
        outline: "bg-transparent text-mist border border-slate-600/50",
        success: "bg-emerald/10 text-emerald border border-emerald/20",
        warning: "bg-amber/10 text-amber border border-amber/20",
        ghost: "bg-slate-800/50 text-mist border border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
