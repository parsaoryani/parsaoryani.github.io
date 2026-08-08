"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils/cn"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "left" | "right" | "scale"
  delay?: number
  threshold?: number
  rootMargin?: string
  once?: boolean
  id?: string
}

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  once = true,
  id,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          if (once) observer.unobserve(element)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [delay, threshold, rootMargin, once])

  const directionClasses = {
    up: "scroll-reveal",
    left: "scroll-reveal-left",
    right: "scroll-reveal-right",
    scale: "scroll-reveal-scale",
  }

  return (
    <div
      ref={ref}
      id={id}
      className={cn(
        directionClasses[direction],
        isVisible && "is-visible",
        className
      )}
    >
      {children}
    </div>
  )
}