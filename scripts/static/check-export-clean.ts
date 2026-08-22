import { rm } from "node:fs/promises"
import { prisma } from "@/lib/db/prisma"
import { runStaticExport } from "@/lib/static-export/exporter"

runStaticExport({ promote: false })
  .then(async (result) => {
    if (result.stagedFiles) {
      await rm(result.stagedFiles.stagingDir, { recursive: true, force: true })
    }

    if (result.changedFiles.length > 0) {
      console.error("Generated static snapshot is stale. Re-run npm run static:export.")
      for (const file of result.changedFiles) console.error(`- ${file}`)
      await prisma.$disconnect()
      process.exit(1)
    }

    console.log("Generated static snapshot matches a fresh local export")
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect().catch(() => undefined)
    process.exit(2)
  })
