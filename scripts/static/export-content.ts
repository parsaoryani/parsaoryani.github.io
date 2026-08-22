import { prisma } from "@/lib/db/prisma"
import { runStaticExport } from "@/lib/static-export/exporter"

runStaticExport({ promote: true })
  .then(async (result) => {
    console.log("Exported and validated public static snapshot")
    console.log(JSON.stringify({ counts: result.counts, changedFiles: result.changedFiles }, null, 2))
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect().catch(() => undefined)
    process.exit(1)
  })
