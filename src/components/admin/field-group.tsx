"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

export function FieldGroup({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
        {label}
        {required && <span className="text-[var(--danger)] text-xs">*</span>}
      </label>
      {hint && <p className="text-xs text-[var(--text-tertiary)]">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs text-[var(--danger)]" role="alert">{error}</p>
      )}
    </div>
  )
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-xs text-[var(--text-tertiary)] mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}