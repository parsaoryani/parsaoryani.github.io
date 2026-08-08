"use client"

import * as React from "react"
import { cn } from "@/lib/utils/cn"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within Tabs")
  }
  return context
}

interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [activeValue, setActiveValue] = React.useState(defaultValue)
  const controlled = value !== undefined

  const currentValue = controlled ? value : activeValue

  const handleValueChange = React.useCallback((v: string) => {
    if (!controlled) setActiveValue(v)
    onValueChange?.(v)
  }, [controlled, onValueChange])

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("space-y-4", className)} data-tabs>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div role="tablist" className={cn("flex items-center gap-1 p-1 rounded-lg border border-slate-700/50 bg-slate-800/30", className)}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function TabsTrigger({ value, disabled, children, className }: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = useTabsContext()
  const isActive = activeValue === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      className={cn(
        "px-4 py-2 text-sm font-mono rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan/50",
        isActive
          ? "bg-cyan/10 text-cyan border border-cyan/20"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: activeValue } = useTabsContext()
  const isActive = activeValue === value

  if (!isActive) return null

  return (
    <div role="tabpanel" className={cn("animate-fade-in", className)}>
      {children}
    </div>
  )
}