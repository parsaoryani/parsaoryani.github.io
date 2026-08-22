"use client"

import { useState, useTransition } from "react"

interface ExportResponse {
  ok?: boolean
  error?: string
  counts?: Record<string, number>
  changedFiles?: string[]
}

export function StaticPublishClient() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ExportResponse | null>(null)

  function runExport() {
    startTransition(async () => {
      setResult(null)
      const response = await fetch("/api/admin/static-export", { method: "POST" })
      const payload = (await response.json().catch(() => ({ error: "Invalid export response" }))) as ExportResponse
      setResult(response.ok ? { ...payload, ok: true } : payload)
    })
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={runExport}
        disabled={isPending}
        className="inline-flex items-center rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-void transition hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Exporting..." : "Export public snapshot"}
      </button>

      {result && (
        <div
          role="status"
          className={`rounded-lg border p-4 text-sm ${
            result.ok ? "border-emerald/30 bg-emerald/10 text-emerald" : "border-coral/30 bg-coral/10 text-coral"
          }`}
        >
          {result.ok ? (
            <div className="space-y-3">
              <p className="font-semibold">Snapshot exported.</p>
              {result.counts && (
                <pre className="overflow-x-auto rounded bg-void/40 p-3 text-xs text-fog">
                  {JSON.stringify(result.counts, null, 2)}
                </pre>
              )}
              <p className="text-xs text-[var(--text-secondary)]">
                Next command: <code>npm run static:verify</code>
              </p>
            </div>
          ) : (
            <p>{result.error ?? "Static export failed"}</p>
          )}
        </div>
      )}
    </div>
  )
}
