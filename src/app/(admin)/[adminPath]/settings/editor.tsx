"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, X } from "lucide-react"

export function SettingsEditor({ settings }: { settings: any[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  async function save(id: string) {
    let parsed: any
    try {
      parsed = JSON.parse(editValue)
    } catch {
      parsed = editValue
    }
    await fetch(`/api/settings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: parsed }),
    })
    setEditing(null)
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.id} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
            <h3 className="text-sm font-medium font-mono text-[var(--accent)] mb-1">{setting.key}</h3>
            {editing === setting.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={4}
                  className="font-mono text-xs"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => save(setting.id)}><Check size={14} /> Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(null)}><X size={14} /> Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="group flex items-start gap-2">
                <pre className="text-sm text-[var(--text-secondary)] overflow-x-auto flex-1">
                  {JSON.stringify(setting.value, null, 2)}
                </pre>
                <button
                  onClick={() => { setEditing(setting.id); setEditValue(JSON.stringify(setting.value, null, 2)) }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[var(--accent)] font-mono mt-1"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
        {settings.length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)] font-mono">No custom settings.</p>
        )}
      </div>
    </div>
  )
}
