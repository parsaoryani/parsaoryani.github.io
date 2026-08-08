"use client"

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"
import { ChevronRight, Save, Trash2, Eye, AlertTriangle } from "lucide-react"

export interface Breadcrumb {
  label: string
  href?: string
}

export interface EditorProps {
  title: string
  breadcrumbs: Breadcrumb[]
  status?: "draft" | "published"
  version?: number
  savedAt?: string | null
  error?: string | null
  fieldErrors?: Record<string, string[]> | null
  dirty?: boolean
  submitting?: boolean
  onDelete?: () => void
  onPublish?: () => void
  onSave?: () => void
  children: ReactNode
}

export function EditorLayout({
  title,
  breadcrumbs,
  status,
  version,
  savedAt,
  error,
  fieldErrors,
  dirty = false,
  submitting = false,
  onDelete,
  onPublish,
  onSave,
  children,
}: EditorProps) {
  const router = useRouter()
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [initialSnapshot, setInitialSnapshot] = useState("")
  const [currentSnapshot, setCurrentSnapshot] = useState("")

  // Track dirty state via form content snapshots
  const takeSnapshot = useCallback(() => {
    if (!formRef.current) return ""
    const fd = new FormData(formRef.current)
    return JSON.stringify(Object.fromEntries(fd.entries()))
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const snapshot = takeSnapshot()
      setInitialSnapshot(snapshot)
      setCurrentSnapshot(snapshot)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [takeSnapshot])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSnapshot(takeSnapshot())
    }, 500)
    return () => clearInterval(interval)
  }, [takeSnapshot])

  const isDirty = dirty || (initialSnapshot !== currentSnapshot && currentSnapshot !== "")

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isDirty])

  // Intercept route changes
  useEffect(() => {
    const handler = () => {
      if (isDirty) {
        setShowUnsavedWarning(true)
        return false
      }
    }
    window.addEventListener("popstate", handler)
    return () => window.removeEventListener("popstate", handler)
  }, [isDirty])

  return (
    <div className="max-w-3xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] font-mono mb-4" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight size={10} className="text-[var(--text-tertiary)]" />}
            {crumb.href ? (
              <button type="button" onClick={() => router.push(crumb.href!)} className="hover:text-[var(--accent)] transition-colors">
                {crumb.label}
              </button>
            ) : (
              <span className="text-[var(--text-secondary)]">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Title + Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{title}</h1>
          {status && (
            <span className={cn(
              "px-2 py-0.5 text-xs font-mono rounded-full",
              status === "published" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
            )}>
              {status}
            </span>
          )}
          {version !== undefined && (
            <span className="text-xs text-[var(--text-tertiary)] font-mono">v{version}</span>
          )}
        </div>
        {savedAt && (
          <span className="text-xs text-[var(--text-tertiary)] font-mono">
            Saved {new Date(savedAt).toLocaleString()}
          </span>
        )}
      </div>

      {/* Error Summary */}
      {(error || (fieldErrors && Object.keys(fieldErrors).length > 0)) && (
        <div className="mb-6 p-4 rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/5" role="alert">
          <div className="flex items-center gap-2 text-[var(--danger)] font-medium text-sm mb-1">
            <AlertTriangle size={14} />
            {error || "Please fix the errors below"}
          </div>
          {fieldErrors && Object.keys(fieldErrors).length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-[var(--danger)]/80">
              {Object.entries(fieldErrors).map(([field, messages]) => (
                messages.map((msg, idx) => (
                  <li key={`${field}-${idx}`}>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(field)
                        el?.scrollIntoView({ behavior: "smooth", block: "center" })
                        el?.focus()
                      }}
                      className="hover:underline"
                    >
                      {field}: {msg}
                    </button>
                  </li>
                ))
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Form Content */}
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault()
          onSave?.()
        }}
        className="space-y-6"
      >
        {children}

        {/* Action Bar */}
        <div className="sticky bottom-0 bg-[var(--bg)] border-t border-[var(--border)] -mx-6 px-6 py-4 flex items-center justify-between">
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting || !isDirty}>
              <Save size={14} className="mr-1.5" />
              {submitting ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
          <div className="flex gap-3">
            {onPublish && status === "draft" && (
              <Button type="button" variant="outline" onClick={onPublish}>
                <Eye size={14} className="mr-1.5" />
                Publish
              </Button>
            )}
            {onDelete && (
              <Button type="button" variant="danger" onClick={onDelete}>
                <Trash2 size={14} className="mr-1.5" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-6 max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Unsaved Changes</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              You have unsaved changes. Are you sure you want to leave?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowUnsavedWarning(false)}>
                Stay
              </Button>
              <Button variant="danger" onClick={() => {
                setShowUnsavedWarning(false)
                router.back()
              }}>
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
