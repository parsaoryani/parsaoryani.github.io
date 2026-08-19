import { prisma } from "@/lib/db/prisma"
import { PublicationsList } from "@/components/admin/publications-list"

export default async function AdminPublicationsPage() {
  const publications = await prisma.publication.findMany({
    where: { deletedAt: null },
    include: { tags: { include: { tag: true } } },
    orderBy: [{ year: "desc" }, { sortOrder: "asc" }],
  })

  const serialized = publications.map((pub) => ({
    ...pub,
    authors: (pub.authors || []) as { name: string; isMe?: boolean }[],
    contributions: (pub.contributions || []) as string[],
    techStack: (pub as Record<string, unknown>).techStack ? (pub as Record<string, unknown>).techStack as string[] : [],
    createdAt: pub.createdAt.toISOString(),
    updatedAt: pub.updatedAt.toISOString(),
    publishedAt: pub.publishedAt.toISOString(),
  }))

  return <PublicationsList publications={serialized} />
}