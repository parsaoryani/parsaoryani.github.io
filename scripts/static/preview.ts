import { createServer } from "node:http"
import { createReadStream } from "node:fs"
import { stat } from "node:fs/promises"
import path from "node:path"

const root = path.join(process.cwd(), "out")
const port = Number(process.env.STATIC_PREVIEW_PORT ?? 4173)

function resolvePath(urlPath: string) {
  const clean = decodeURIComponent(urlPath.split("?")[0] || "/")
  const relative = clean.endsWith("/") ? `${clean}index.html` : clean
  return path.join(root, relative)
}

const server = createServer(async (req, res) => {
  const file = resolvePath(req.url || "/")
  try {
    const info = await stat(file)
    if (!info.isFile()) throw new Error("not file")
    createReadStream(file).pipe(res)
  } catch {
    res.statusCode = 404
    createReadStream(path.join(root, "404.html")).on("error", () => res.end("Not found")).pipe(res)
  }
})

server.listen(port, "127.0.0.1", () => {
  console.log(`Ready: http://127.0.0.1:${port}/`)
})
