"use client"

import * as React from "react"
import { cn } from "@/lib/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-cyan to-indigo text-void hover:from-cyan-deep hover:to-indigo/90 shadow-lg shadow-cyan/20 hover:shadow-cyan/30",
        secondary:
          "bg-slate-800/80 text-fog hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600/50",
        outline:
          "border border-slate-700 bg-transparent hover:bg-slate-800/50 text-mist hover:text-fog",
        ghost:
          "bg-transparent hover:bg-slate-800/50 text-mist hover:text-fog",
        danger:
          "bg-coral/10 text-coral hover:bg-coral/20 border border-coral/20",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
