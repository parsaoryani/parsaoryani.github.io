import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { config, proxy } from "@/proxy"

describe("request proxy", () => {
  it("uses the Next.js 16 proxy convention and passes public pages through", () => {
    const response = proxy(new NextRequest("https://parsaoryani.me/about"))

    expect(typeof proxy).toBe("function")
    expect(config.matcher).toHaveLength(1)
    expect(response.headers.get("x-middleware-next")).toBe("1")
  })
})
