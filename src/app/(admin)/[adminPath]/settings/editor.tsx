"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, AlertCircle, Home, Save } from "lucide-react"
import { HOME_SETTING_KEYS } from "@/lib/home/hero"

interface SettingsEditorProps {
  settings: Array<{ id: string; key: string; value: unknown }>
}

export function SettingsEditor({ settings }: SettingsEditorProps) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const homeTitle = settings.find((s) => s.key === "home_title")
  const homeDescription = settings.find((s) => s.key === "home_description")
  const [titleValue, setTitleValue] = useState(() => (typeof homeTitle?.value === "string" ? homeTitle.value : ""))
  const [descriptionValue, setDescriptionValue] = useState(() =>
    typeof homeDescription?.value === "string" ? homeDescription.value : ""
  )
  const [homeSaving, setHomeSaving] = useState(false)
  const [homeError, setHomeError] = useState<string | null>(null)
  const [homeSaved, setHomeSaved] = useState(false)

  const otherSettings = settings.filter((s) => !HOME_SETTING_KEYS.includes(s.key as (typeof HOME_SETTING_KEYS)[number]))

  async function saveSetting(id: string, value: unknown) {
    const res = await fetch(`/api/settings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    })
    if (!res.ok) throw new Error("Failed to save setting")
  }

  async function saveHome() {
    if (!homeTitle || !homeDescription) {
      setHomeError("Homepage settings not found in database. Run the seed script first.")
      return
    }
    setHomeSaving(true)
    setHomeError(null)
    setHomeSaved(false)
    try {
      await Promise.all([
        saveSetting(homeTitle.id, titleValue),
        saveSetting(homeDescription.id, descriptionValue),
      ])
      setHomeSaved(true)
      router.refresh()
    } catch {
      setHomeError("Failed to save homepage settings")
    } finally {
      setHomeSaving(false)
    }
  }

  async function save(id: string) {
    let parsed: unknown
    try {
      parsed = JSON.parse(editValue)
    } catch {
      parsed = editValue
    }
    setError(null)
    try {
      await saveSetting(id, parsed)
      setEditing(null)
      router.refresh()
    } catch {
      setError("Failed to save setting")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg bg-coral/10 text-coral border border-coral/20 text-sm">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Homepage hero */}
      <div className="mb-8 p-5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="flex items-center gap-2 mb-4">
          <Home size={16} className="text-[var(--accent)]" />
          <h2 className="text-base font-semibold">Homepage Hero</h2>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] font-mono mb-4">
          Controls the main title and description shown at the top of the home page. Each line of the title is
          rendered on its own row.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="home-title">
              Title <span className="text-[var(--text-tertiary)] font-mono text-xs">(one line per row)</span>
            </label>
            <Textarea
              id="home-title"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              rows={3}
              className="font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="home-description">
              Description
            </label>
            <Textarea
              id="home-description"
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
              rows={4}
              className="font-mono text-xs"
            />
          </div>

          {homeError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-coral/10 text-coral border border-coral/20 text-sm">
              <AlertCircle size={14} /> {homeError}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button size="sm" onClick={saveHome} disabled={homeSaving}>
              <Save size={14} className="mr-1.5" /> {homeSaving ? "Saving..." : "Save homepage"}
            </Button>
            {homeSaved && <span className="text-xs text-emerald flex items-center gap-1"><Check size={12} /> Saved</span>}
          </div>
        </div>
      </div>

      {/* Other settings */}
      <h2 className="text-sm font-medium text-[var(--text-tertiary)] font-mono mb-3 uppercase tracking-wider">
        Other settings
      </h2>

      <div className="space-y-4">
        {otherSettings.map((setting) => (
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
        {otherSettings.length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)] font-mono">No other custom settings.</p>
        )}
      </div>
    </div>
  )
}