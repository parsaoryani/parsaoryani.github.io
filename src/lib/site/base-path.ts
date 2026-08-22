const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function withBasePath(path: string): string {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:") ||
    path.startsWith("#")
  ) {
    return path
  }

  if (!path.startsWith("/")) {
    throw new Error(`Expected a root-relative path, got "${path}"`)
  }

  if (!basePath) return path
  if (path === basePath || path.startsWith(`${basePath}/`)) return path
  return `${basePath}${path}`
}
