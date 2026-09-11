import type { Metadata } from "next"
import Link from "next/link"
import { withBasePath } from "@/lib/site/base-path"
import { canonicalPath } from "@/lib/site/metadata"

const target = "/experience/#teaching-assistance"

export const metadata: Metadata = {
  title: "Teaching",
  robots: { index: false, follow: true },
  alternates: canonicalPath(target),
}

export default function TeachingCompatibilityPage() {
  const href = withBasePath(target)
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <main className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold mb-3">Teaching assistantships moved</h1>
          <Link href={target} className="text-cyan hover:underline">
            Continue to teaching assistantships
          </Link>
        </div>
      </main>
    </>
  )
}
