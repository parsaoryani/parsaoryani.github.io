"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ContentList, type ListColumn } from "@/components/admin/content-list"
import { Edit, ExternalLink } from "lucide-react"

interface Publication {
  id: string
  slug: string
  title: string
  venue: string
  year: number
  status: string
  featured: boolean
  authors: unknown
}

const columns: ListColumn<Publication>[] = [
  {
    key: "title",
    label: "Title",
    render: (pub) => (
      <div>
        <p className="font-medium truncate max-w-[300px]">{pub.title}</p>
        <p className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">
          {pub.venue} · {pub.year}
        </p>
      </div>
    ),
  },
  {
    key: "authors",
    label: "Authors",
    render: (pub) => (
      <p className="text-xs text-[var(--text-secondary)] truncate max-w-[200px]">
        {Array.isArray(pub.authors) ? pub.authors.map((a: { name?: string }) => a.name).filter(Boolean).join(", ") : "N/A"}
      </p>
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "status",
    label: "Status",
    render: (pub) => (
      <Badge variant={pub.status === "published" ? "success" : "warning"} className="font-mono text-[10px]">
        {pub.status}
      </Badge>
    ),
    className: "w-24",
  },
  {
    key: "actions",
    label: "",
    render: (pub) => (
      <div className="flex items-center gap-1 justify-end">
        <Link href={`publications/${pub.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={14} /></Button>
        </Link>
        <Link href={`/research/${pub.slug}`} target="_blank">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink size={14} /></Button>
        </Link>
      </div>
    ),
    className: "w-24",
  },
]

const filters = [
  {
    key: "status",
    label: "All statuses",
    options: [
      { value: "draft", label: "Draft" },
      { value: "published", label: "Published" },
    ],
  },
]

export function PublicationsList({ publications }: { publications: Publication[] }) {
  return (
    <ContentList
      title="Publications"
      createHref="publications/new"
      createLabel="New Publication"
      columns={columns}
      filters={filters}
      items={publications}
      searchPlaceholder="Search publications..."
      searchKey="title"
      emptyTitle="No publications yet"
      emptyDescription="Add your first publication to get started."
    />
  )
}