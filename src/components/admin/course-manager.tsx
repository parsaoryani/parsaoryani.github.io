"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Trash2, GripVertical, Save, Plus, Download, Link as LinkIcon, ExternalLink } from "lucide-react"

type Course = {
  id: string
  name: string
  grade: string | null
  exercises: string | null
  projects: string | null
  discussions: string | null
  sortOrder: number
  files: CourseFile[]
  links: CourseLink[]
}

type CourseFile = {
  id: string
  name: string
  url: string
  kind: string
  size: number | null
  mimeType: string | null
  sortOrder: number
}

type CourseLink = {
  id: string
  type: "exercise" | "project"
  name: string
  url: string
  sortOrder: number
}

type CourseFormData = {
  name: string
  grade: string
  exercises: string
  projects: string
  discussions: string
}

type LinkFormData = {
  type: "exercise" | "project"
  name: string
  url: string
}

export function CourseManager({ timelineEventId, isEducation }: { timelineEventId: string; isEducation: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newCourse, setNewCourse] = useState<CourseFormData>({ name: "", grade: "", exercises: "", projects: "", discussions: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<CourseFormData>({ name: "", grade: "", exercises: "", projects: "", discussions: "" })
  const [showLinkForm, setShowLinkForm] = useState<{ courseId: string; type: "exercise" | "project" } | null>(null)
  const [newLink, setNewLink] = useState<LinkFormData>({ type: "exercise", name: "", url: "" })
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [editLinkForm, setEditLinkForm] = useState<LinkFormData>({ type: "exercise", name: "", url: "" })
  const [submitting, setSubmitting] = useState(false)
  const [, setUploading] = useState<Record<string, boolean>>({})

  async function loadCourses() {
    try {
      const res = await fetch(`/api/timeline/${timelineEventId}/courses`)
      if (res.ok) {
        const data = await res.json()
        setCourses(data)
      }
    } catch {
      setError("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isEducation) return
    let cancelled = false
    fetch(`/api/timeline/${timelineEventId}/courses`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setCourses(data)
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load courses")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [timelineEventId, isEducation])

  async function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/timeline/${timelineEventId}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      })
      if (!res.ok) throw new Error()
      setShowNewForm(false)
      setNewCourse({ name: "", grade: "", exercises: "", projects: "", discussions: "" })
      await loadCourses()
    } catch {
      setError("Failed to create course")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdateCourse(courseId: string) {
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/timeline/${timelineEventId}/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) throw new Error()
      setEditingId(null)
      await loadCourses()
    } catch {
      setError("Failed to update course")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteCourse(courseId: string) {
    if (!confirm("Delete this course and all its files?")) return
    try {
      const res = await fetch(`/api/timeline/${timelineEventId}/courses/${courseId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      await loadCourses()
    } catch {
      setError("Failed to delete course")
    }
  }

  async function handleReorderCourses(newOrder: string[]) {
    try {
      await fetch(`/api/timeline/${timelineEventId}/courses/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseIds: newOrder }),
      })
    } catch {}
  }

  function handleDragStart(e: React.DragEvent, courseId: string) {
    e.dataTransfer.setData("courseId", courseId)
    e.dataTransfer.effectAllowed = "move"
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  function handleDrop(e: React.DragEvent, targetCourseId: string) {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData("courseId")
    if (draggedId && draggedId !== targetCourseId) {
      const newOrder = [...courses]
      const fromIndex = newOrder.findIndex(c => c.id === draggedId)
      const toIndex = newOrder.findIndex(c => c.id === targetCourseId)
      if (fromIndex !== -1 && toIndex !== -1) {
        const removed = newOrder[fromIndex]
        if (removed) {
          newOrder.splice(fromIndex, 1)
          newOrder.splice(toIndex, 0, removed)
          setCourses(newOrder)
          handleReorderCourses(newOrder.map(c => c.id))
        }
      }
    }
  }

  async function handleFileUpload(courseId: string, file: File, kind: string) {
    setUploading(prev => ({ ...prev, [courseId]: true }))
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("courseId", courseId)
      formData.append("kind", kind)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error()
      await loadCourses()
    } catch {
      setError("Failed to upload file")
    } finally {
      setUploading(prev => ({ ...prev, [courseId]: false }))
    }
  }

  async function handleFileDelete(courseId: string, fileId: string) {
    if (!confirm("Delete this file?")) return
    try {
      const res = await fetch(`/api/courses/${courseId}/files/${fileId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      await loadCourses()
    } catch {
      setError("Failed to delete file")
    }
  }

  async function handleCreateLink(courseId: string, e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/courses/${courseId}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLink),
      })
      if (!res.ok) throw new Error()
      setShowLinkForm(null)
      setNewLink({ type: "exercise", name: "", url: "" })
      await loadCourses()
    } catch {
      setError("Failed to create link")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdateLink(courseId: string, linkId: string) {
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/courses/${courseId}/links/${linkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editLinkForm),
      })
      if (!res.ok) throw new Error()
      setEditingLinkId(null)
      await loadCourses()
    } catch {
      setError("Failed to update link")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteLink(courseId: string, linkId: string) {
    if (!confirm("Delete this link?")) return
    try {
      const res = await fetch(`/api/courses/${courseId}/links/${linkId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      await loadCourses()
    } catch {
      setError("Failed to delete link")
    }
  }

  function formatFileSize(bytes: number | null) {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (!isEducation) {
    return (
      <div className="p-4 rounded-lg border border-slate-700/50 bg-slate-800/30">
        <p className="text-sm text-[var(--text-secondary)]">Courses are only available for Education timeline events.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="py-8 text-center text-[var(--text-secondary)]">Loading courses...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Courses</h2>
        <Button onClick={() => setShowNewForm(true)} size="sm" className="gap-1.5">
          <Plus size={14} /> Add Course
        </Button>
      </div>

      {showNewForm && (
        <div className="p-4 rounded-lg border border-cyan/20 bg-slate-800/30 space-y-4">
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Course Name *</Label>
              <Input id="new-name" required value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-grade">Grade</Label>
              <Input id="new-grade" placeholder="A, B+, 95%, etc." value={newCourse.grade} onChange={e => setNewCourse({ ...newCourse, grade: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-exercises">Exercises / Assignments</Label>
              <Textarea id="new-exercises" rows={3} placeholder="Describe exercises, problem sets, labs..." value={newCourse.exercises} onChange={e => setNewCourse({ ...newCourse, exercises: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-projects">Projects</Label>
              <Textarea id="new-projects" rows={3} placeholder="Describe course projects, final projects..." value={newCourse.projects} onChange={e => setNewCourse({ ...newCourse, projects: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-discussions">Discussions / Notes</Label>
              <Textarea id="new-discussions" rows={3} placeholder="Key discussions, insights, topics covered..." value={newCourse.discussions} onChange={e => setNewCourse({ ...newCourse, discussions: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={submitting || !newCourse.name.trim()}>{submitting ? "Creating..." : "Create Course"}</Button>
              <Button type="button" variant="ghost" onClick={() => { setShowNewForm(false); setNewCourse({ name: "", grade: "", exercises: "", projects: "", discussions: "" }); }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

      <div className="space-y-4">
        {courses.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)] font-mono text-center py-8">
            No courses added yet. Click &quot;Add Course&quot; to start.
          </p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              draggable
              onDragStart={e => handleDragStart(e, course.id)}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, course.id)}
              className="relative rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden group"
            >
              <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="text-[var(--text-tertiary)] cursor-grab" size={18} />
              </div>

              {editingId === course.id ? (
                <form onSubmit={e => { e.preventDefault(); handleUpdateCourse(course.id); }} className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-name-${course.id}`}>Course Name *</Label>
                    <Input id={`edit-name-${course.id}`} required defaultValue={editForm.name || course.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-grade-${course.id}`}>Grade</Label>
                    <Input id={`edit-grade-${course.id}`} placeholder="A, B+, 95%, etc." defaultValue={editForm.grade || course.grade || ""} onChange={e => setEditForm({ ...editForm, grade: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-exercises-${course.id}`}>Exercises / Assignments</Label>
                    <Textarea id={`edit-exercises-${course.id}`} rows={3} defaultValue={editForm.exercises || course.exercises || ""} onChange={e => setEditForm({ ...editForm, exercises: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-projects-${course.id}`}>Projects</Label>
                    <Textarea id={`edit-projects-${course.id}`} rows={3} defaultValue={editForm.projects || course.projects || ""} onChange={e => setEditForm({ ...editForm, projects: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-discussions-${course.id}`}>Discussions / Notes</Label>
                    <Textarea id={`edit-discussions-${course.id}`} rows={3} defaultValue={editForm.discussions || course.discussions || ""} onChange={e => setEditForm({ ...editForm, discussions: e.target.value })} />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={submitting} size="sm">{submitting ? "Saving..." : "Save"}</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setEditingId(null); setEditForm({ name: "", grade: "", exercises: "", projects: "", discussions: "" }); }}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-lg">{course.name}</h3>
                        {course.grade && <span className="px-2 py-0.5 text-xs font-mono rounded bg-cyan/10 text-cyan border border-cyan/20">{course.grade}</span>}
                      </div>
                      {(course.exercises || course.projects || course.discussions) && (
                        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                          {course.exercises && <p><strong>Exercises:</strong> {course.exercises}</p>}
                          {course.projects && <p><strong>Projects:</strong> {course.projects}</p>}
                          {course.discussions && <p><strong>Discussions:</strong> {course.discussions}</p>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingId(course.id); setEditForm({ name: course.name, grade: course.grade || "", exercises: course.exercises || "", projects: course.projects || "", discussions: course.discussions || "" }); }}><Save size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--danger)]" onClick={() => handleDeleteCourse(course.id)}><Trash2 size={14} /></Button>
                    </div>
                  </div>

                  {/* Files section */}
                  <div className="border-t border-[var(--border)] pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">Files ({course.files.length})</h4>
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={12} /> Add File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={e => e.target.files?.[0] && handleFileUpload(course.id, e.target.files[0], "file")}
                      />
                    </div>

                    {course.files.length === 0 ? (
                      <p className="text-xs text-[var(--text-tertiary)] font-mono">No files uploaded yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {course.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-slate-800/50">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="text-[var(--text-secondary)]" size={18} />
                              <div className="min-w-0">
                                <p className="text-sm truncate font-medium">{file.name}</p>
                                <p className="text-xs text-[var(--text-tertiary)] font-mono">{formatFileSize(file.size)} · {file.kind}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-cyan"><Download size={14} /></a>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--danger)]" onClick={() => handleFileDelete(course.id, file.id)}><Trash2 size={12} /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Links section (Exercise/Project links) */}
                  <div className="border-t border-[var(--border)] pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">Links ({course.links.length})</h4>
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowLinkForm({ courseId: course.id, type: "exercise" })}>
                        <Plus size={12} /> Add Exercise Link
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowLinkForm({ courseId: course.id, type: "project" })}>
                        <Plus size={12} /> Add Project Link
                      </Button>
                    </div>

                    {showLinkForm && showLinkForm.courseId === course.id && (
                      <form onSubmit={e => handleCreateLink(course.id, e)} className="p-3 rounded-lg border border-cyan/20 bg-slate-800/30 space-y-3 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor={`link-type-${course.id}`}>Type</Label>
                          <select id={`link-type-${course.id}`} value={newLink.type} onChange={e => setNewLink({ ...newLink, type: e.target.value as "exercise" | "project" })} className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog">
                            <option value="exercise">Exercise</option>
                            <option value="project">Project</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`link-name-${course.id}`}>Display Name *</Label>
                          <Input id={`link-name-${course.id}`} required placeholder="e.g. Final Project, Assignment 1, Lab 3" value={newLink.name} onChange={e => setNewLink({ ...newLink, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`link-url-${course.id}`}>URL *</Label>
                          <Input id={`link-url-${course.id}`} required type="url" placeholder="https://github.com/..." value={newLink.url} onChange={e => setNewLink({ ...newLink, url: e.target.value })} />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" disabled={submitting || !newLink.name.trim() || !newLink.url.trim()} size="sm">{submitting ? "Adding..." : "Add Link"}</Button>
                          <Button type="button" variant="ghost" size="sm" onClick={() => { setShowLinkForm(null); setNewLink({ type: "exercise", name: "", url: "" }); }}>Cancel</Button>
                        </div>
                      </form>
                    )}

                    {course.links.length === 0 && !showLinkForm ? (
                      <p className="text-xs text-[var(--text-tertiary)] font-mono">
                        No links added yet. Click &quot;Add Exercise Link&quot; or &quot;Add Project Link&quot; to start.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {course.links.filter(l => l.type === "exercise").map((link) => (
                          editingLinkId === link.id ? (
                            <form key={link.id} onSubmit={e => { e.preventDefault(); handleUpdateLink(course.id, link.id); }} className="p-3 rounded-lg border border-cyan/20 bg-slate-800/30 space-y-2">
                              <div className="space-y-2">
                                <Label htmlFor={`edit-link-name-${link.id}`}>Display Name *</Label>
                                <Input id={`edit-link-name-${link.id}`} required defaultValue={editLinkForm.name || link.name} onChange={e => setEditLinkForm({ ...editLinkForm, name: e.target.value })} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit-link-url-${link.id}`}>URL *</Label>
                                <Input id={`edit-link-url-${link.id}`} required type="url" defaultValue={editLinkForm.url || link.url} onChange={e => setEditLinkForm({ ...editLinkForm, url: e.target.value })} />
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit" disabled={submitting} size="sm">{submitting ? "Saving..." : "Save"}</Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => { setEditingLinkId(null); setEditLinkForm({ type: "exercise", name: "", url: "" }); }}>Cancel</Button>
                              </div>
                            </form>
                          ) : (
                            <div key={link.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-slate-800/50">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <LinkIcon className="text-emerald" size={18} />
                                <div className="min-w-0">
                                  <p className="text-sm truncate font-medium">{link.name}</p>
                                  <p className="text-xs text-[var(--text-tertiary)] font-mono">{link.url}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-cyan"><ExternalLink size={14} /></a>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingLinkId(link.id); setEditLinkForm({ type: "exercise", name: link.name, url: link.url }); }}><Save size={12} /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--danger)]" onClick={() => handleDeleteLink(course.id, link.id)}><Trash2 size={12} /></Button>
                              </div>
                            </div>
                          )
                        ))}
                        {course.links.filter(l => l.type === "project").map((link) => (
                          editingLinkId === link.id ? (
                            <form key={link.id} onSubmit={e => { e.preventDefault(); handleUpdateLink(course.id, link.id); }} className="p-3 rounded-lg border border-cyan/20 bg-slate-800/30 space-y-2">
                              <div className="space-y-2">
                                <Label htmlFor={`edit-link-name-${link.id}`}>Display Name *</Label>
                                <Input id={`edit-link-name-${link.id}`} required defaultValue={editLinkForm.name || link.name} onChange={e => setEditLinkForm({ ...editLinkForm, name: e.target.value })} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit-link-url-${link.id}`}>URL *</Label>
                                <Input id={`edit-link-url-${link.id}`} required type="url" defaultValue={editLinkForm.url || link.url} onChange={e => setEditLinkForm({ ...editLinkForm, url: e.target.value })} />
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit" disabled={submitting} size="sm">{submitting ? "Saving..." : "Save"}</Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => { setEditingLinkId(null); setEditLinkForm({ type: "project", name: "", url: "" }); }}>Cancel</Button>
                              </div>
                            </form>
                          ) : (
                            <div key={link.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-slate-800/50">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <LinkIcon className="text-cyan" size={18} />
                                <div className="min-w-0">
                                  <p className="text-sm truncate font-medium">{link.name}</p>
                                  <p className="text-xs text-[var(--text-tertiary)] font-mono">{link.url}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-cyan"><ExternalLink size={14} /></a>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingLinkId(link.id); setEditLinkForm({ type: "project", name: link.name, url: link.url }); }}><Save size={12} /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--danger)]" onClick={() => handleDeleteLink(course.id, link.id)}><Trash2 size={12} /></Button>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}