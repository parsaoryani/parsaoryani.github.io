"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, AlertCircle, Home, Save, EyeOff } from "lucide-react"
import { HOME_SETTING_KEYS } from "@/lib/home/hero"
import {
  TIMELINE_SECTIONS_SETTING_KEY,
  TIMELINE_SECTION_TYPES,
  TIMELINE_SECTION_LABELS,
  parseHiddenSections,
  type TimelineSectionType,
} from "@/lib/timeline/sections"
import { NAV_RESEARCH_SETTING_KEY, parseShowResearch } from "@/lib/site/visibility"

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

  const sectionVisibility = settings.find((s) => s.key === TIMELINE_SECTIONS_SETTING_KEY)
  const [hiddenSections, setHiddenSections] = useState<TimelineSectionType[]>(() =>
    parseHiddenSections(sectionVisibility?.value)
  )
  const [sectionsSaving, setSectionsSaving] = useState(false)
  const [sectionsError, setSectionsError] = useState<string | null>(null)
  const [sectionsSaved, setSectionsSaved] = useState(false)

  const navResearchSetting = settings.find((s) => s.key === NAV_RESEARCH_SETTING_KEY)
  const [showResearch, setShowResearch] = useState(() => parseShowResearch(navResearchSetting?.value))
  const [navSaving, setNavSaving] = useState(false)
  const [navError, setNavError] = useState<string | null>(null)
  const [navSaved, setNavSaved] = useState(false)

  async function saveNavResearch(next: boolean) {
    setShowResearch(next)
    if (!navResearchSetting) {
      setNavError("Research visibility setting not found in database. Run the seed script first.")
      return
    }
    setNavSaving(true)
    setNavError(null)
    setNavSaved(false)
    try {
      await saveSetting(navResearchSetting.id, next)
      setNavSaved(true)
      router.refresh()
    } catch {
      setNavError("Failed to save")
    } finally {
      setNavSaving(false)
    }
  }

  const otherSettings = settings.filter(
    (s) =>
      !HOME_SETTING_KEYS.includes(s.key as (typeof HOME_SETTING_KEYS)[number]) &&
      s.key !== TIMELINE_SECTIONS_SETTING_KEY &&
      s.key !== NAV_RESEARCH_SETTING_KEY
  )

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

  function toggleSection(type: TimelineSectionType) {
    setHiddenSections((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
    setSectionsSaved(false)
  }

  async function saveSections() {
    if (!sectionVisibility) {
      setSectionsError("Section visibility setting not found in database. Run the seed script first.")
      return
    }
    setSectionsSaving(true)
    setSectionsError(null)
    setSectionsSaved(false)
    try {
      await saveSetting(sectionVisibility.id, hiddenSections)
      setSectionsSaved(true)
      router.refresh()
    } catch {
      setSectionsError("Failed to save section visibility")
    } finally {
      setSectionsSaving(false)
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

      {/* Section visibility */}
      <div className="mb-8 p-5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="flex items-center gap-2 mb-4">
          <EyeOff size={16} className="text-[var(--accent)]" />
          <h2 className="text-base font-semibold">Section Visibility</h2>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] font-mono mb-4">
          Hide a whole timeline category everywhere it appears on the public site (About and CV pages). Unchecked
          sections stay visible.
        </p>

        <div className="space-y-2 mb-4">
          {TIMELINE_SECTION_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!hiddenSections.includes(type)}
                onChange={() => toggleSection(type)}
                className="h-4 w-4 rounded border-slate-700 accent-[var(--accent)]"
              />
              {TIMELINE_SECTION_LABELS[type]}
              {hiddenSections.includes(type) && (
                <span className="text-xs font-mono text-[var(--text-tertiary)]">(hidden)</span>
              )}
            </label>
          ))}
        </div>

        {sectionsError && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-coral/10 text-coral border border-coral/20 text-sm">
            <AlertCircle size={14} /> {sectionsError}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button size="sm" onClick={saveSections} disabled={sectionsSaving}>
            <Save size={14} className="mr-1.5" /> {sectionsSaving ? "Saving..." : "Save visibility"}
          </Button>
          {sectionsSaved && <span className="text-xs text-emerald flex items-center gap-1"><Check size={12} /> Saved</span>}
        </div>

        <div className="mt-5 pt-5 border-t border-[var(--border)]">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showResearch}
              onChange={(e) => saveNavResearch(e.target.checked)}
              disabled={navSaving}
              className="h-4 w-4 rounded border-slate-700 accent-[var(--accent)]"
            />
            Show &quot;Research&quot; in navigation &amp; footer
            {navSaved && <span className="text-xs text-emerald flex items-center gap-1 ml-1"><Check size={12} /> Saved</span>}
          </label>
          <p className="text-xs text-[var(--text-tertiary)] font-mono mt-1.5">
            Off by default until real publications are ready to link from the site.
          </p>
          {navError && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-coral/10 text-coral border border-coral/20 text-sm">
              <AlertCircle size={14} /> {navError}
            </div>
          )}
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