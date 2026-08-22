import { spawn } from "node:child_process"
import path from "node:path"

const repoRoot = process.cwd()
const workspace = path.join(repoRoot, ".static-export-workspace")
const nextBin = path.join(repoRoot, "node_modules", ".bin", "next")

const child = spawn(nextBin, ["build"], {
  cwd: workspace,
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: "",
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://parsaoryani.github.io",
  },
})

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`next build terminated by ${signal}`)
    process.exit(1)
  }
  process.exit(code ?? 1)
})
