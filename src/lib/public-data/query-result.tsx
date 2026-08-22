export type QueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: string }

export async function safeQuery<T>(
  query: Promise<T>,
  label: string,
): Promise<QueryResult<T>> {
  try {
    const data = await query
    return { data, error: null }
  } catch (err) {
    console.error(`[query-failure] ${label}:`, err)
    return {
      data: null,
      error: `Failed to load ${label}. Please try again later.`,
    }
  }
}

export function QueryErrorFallback({
  error,
  className,
}: {
  error: string
  className?: string
}) {
  return (
    <div
      role="alert"
      className={`rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400 ${className || ""}`}
    >
      <p>{error}</p>
    </div>
  )
}
