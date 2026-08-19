"use client"

import { useState, useMemo, type ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"
import { Plus, Search, ChevronLeft, ChevronRight, FolderOpen } from "lucide-react"

export interface ListColumn<T> {
  key: string
  label: string
  render: (item: T) => ReactNode
  sortable?: boolean
  className?: string
}

export interface ListFilter {
  key: string
  label: string
  options: { value: string; label: string }[]
}

export interface ContentListProps<T extends { id: string }> {
  title: string
  createHref: string
  createLabel: string
  columns: ListColumn<T>[]
  filters?: ListFilter[]
  items: T[]
  searchPlaceholder?: string
  searchKey?: string
  emptyTitle?: string
  emptyDescription?: string
  page?: number
  totalPages?: number
  totalItems?: number
  onPageChange?: (page: number) => void
}

export function ContentList<T extends { id: string }>({
  title,
  createHref,
  createLabel,
  columns,
  filters = [],
  items,
  searchPlaceholder = "Search...",
  searchKey,
  emptyTitle = "No items yet",
  emptyDescription = "Create your first item to get started.",
  page = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
}: ContentListProps<T>) {
  const [search, setSearch] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const filteredItems = useMemo(() => {
    let result = items

    // Apply filters
    for (const [key, value] of Object.entries(activeFilters)) {
      if (value) {
        result = result.filter((item) => {
          const itemValue = item[key as keyof T]
          return String(itemValue) === value
        })
      }
    }

    // Apply search
    if (search && searchKey) {
      const query = search.toLowerCase()
      result = result.filter((item) => {
        const value = item[searchKey as keyof T]
        return String(value).toLowerCase().includes(query)
      })
    }

    return result
  }, [items, activeFilters, search, searchKey])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link href={createHref}>
          <Button>
            <Plus size={14} className="mr-1.5" />
            {createLabel}
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      {(searchKey || filters.length > 0) && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {searchKey && (
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
              />
            </div>
          )}
          {filters.map((filter) => (
            <select
              key={filter.key}
              value={activeFilters[filter.key] || ""}
              onChange={(e) => setActiveFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-sm text-[var(--text-secondary)]"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}
          {Object.values(activeFilters).some(Boolean) && (
            <Button variant="ghost" size="sm" onClick={() => setActiveFilters({})}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Result count */}
      <p className="text-xs text-[var(--text-tertiary)] font-mono mb-3">
        {totalItems || filteredItems.length} item{(totalItems || filteredItems.length) !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-xl">
          <FolderOpen size={32} className="mx-auto text-[var(--text-tertiary)] mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">{emptyTitle}</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">{emptyDescription}</p>
          <Link href={createHref} className="mt-4 inline-block">
            <Button size="sm" variant="outline">
              <Plus size={12} className="mr-1" />
              {createLabel}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]",
                      col.className
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-elevated)]/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3 text-sm", col.className)}>
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-[var(--text-tertiary)] font-mono">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}