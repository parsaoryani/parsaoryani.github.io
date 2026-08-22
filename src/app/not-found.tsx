import Link from "next/link"

export default function NotFound() {
  return (
    <main data-static-404="true" className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 py-20">
      <p className="font-mono text-sm text-cyan">404</p>
      <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        This public static site does not have a page at that address.
      </p>
      <Link href="/" className="mt-6 inline-flex w-fit rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-void">
        Return home
      </Link>
    </main>
  )
}
