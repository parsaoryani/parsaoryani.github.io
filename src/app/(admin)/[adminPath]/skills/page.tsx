import { prisma } from "@/lib/db/prisma"
import { SkillsManager } from "./skills-manager"

export default async function AdminSkillsPage() {
  const categories = await prisma.skillCategory.findMany({
    include: { skills: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  })

  return <SkillsManager categories={JSON.parse(JSON.stringify(categories))} />
}
