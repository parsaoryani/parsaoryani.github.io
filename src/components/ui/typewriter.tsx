"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils/cn"

export interface TypewriterSegment {
  text: string
  className?: string
  breakAfter?: boolean
}

interface TypewriterTextProps {
  segments: TypewriterSegment[]
  speed?: number
  startDelay?: number
  showCursor?: boolean
  cursorClassName?: string
}

export function TypewriterText({
  segments,
  speed = 55,
  startDelay = 700,
  showCursor = true,
  cursorClassName,
}: TypewriterTextProps) {
  const totalLength = segments.reduce((acc, seg) => acc + seg.text.length, 0)
  const [count, setCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timerRef.current = setTimeout(() => setCount(totalLength), 0)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }

    let cancelled = false
    let i = 0

    const typeNext = () => {
      if (cancelled) return
      i += 1
      setCount(i)
      if (i < totalLength) {
        timerRef.current = setTimeout(typeNext, speed)
      }
    }

    timerRef.current = setTimeout(() => {
      setCount(0)
      timerRef.current = setTimeout(typeNext, speed)
    }, startDelay)

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [totalLength, speed, startDelay])

  const offsets = segments.reduce<number[]>((acc, seg) => {
    const prev = acc.length > 0 ? acc[acc.length - 1]! : 0
    acc.push(prev + seg.text.length)
    return acc
  }, [])

  return (
    <span className="inline-block" aria-live="polite">
      {segments.map((seg, i) => {
        const segStart = i === 0 ? 0 : offsets[i - 1]!
        const typedInSegment = Math.max(0, Math.min(count - segStart, seg.text.length))
        if (typedInSegment <= 0) return i === 0 ? <span key={i} className={seg.className} /> : null
        const shown = seg.text.slice(0, typedInSegment)
        return (
          <span key={i}>
            <span className={seg.className}>{shown}</span>
            {seg.breakAfter && typedInSegment === seg.text.length && <br />}
          </span>
        )
      })}
      {showCursor && (
        <span
          aria-hidden="true"
          className={cn(
            "animate-caret-blink inline-block w-[0.5em] h-[0.95em] rounded-sm bg-gradient-to-b from-cyan to-indigo align-baseline",
            cursorClassName
          )}
          style={{ transform: "translateY(0.06em)", marginLeft: count > 0 ? "0.1em" : undefined }}
        />
      )}
    </span>
  )
}