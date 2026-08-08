"use client"

import { useRef, useState, useSyncExternalStore } from "react"
import { cn } from "@/lib/utils/cn"

interface FloatingParticlesProps {
  className?: string
  count?: number
  color?: "cyan" | "indigo" | "emerald" | "mixed"
  size?: "sm" | "md" | "lg"
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  colorClass: string
}

const subscribe = () => () => {}

function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

function generateParticles(count: number, color: NonNullable<FloatingParticlesProps["color"]>, size: NonNullable<FloatingParticlesProps["size"]>): Particle[] {
  const colors = {
    cyan: ["bg-cyan/20", "bg-cyan/10", "bg-cyan/30"],
    indigo: ["bg-indigo/20", "bg-indigo/10", "bg-indigo/30"],
    emerald: ["bg-emerald/20", "bg-emerald/10", "bg-emerald/30"],
    mixed: ["bg-cyan/20", "bg-indigo/20", "bg-emerald/20", "bg-cyan/10", "bg-indigo/10", "bg-emerald/10"],
  }

  const sizes = {
    sm: [2, 4, 6],
    md: [4, 8, 12],
    lg: [8, 16, 24],
  }

  const colorClasses = colors[color]
  const sizeOptions = sizes[size]

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: sizeOptions[Math.floor(Math.random() * sizeOptions.length)] ?? sizeOptions[0]!,
    opacity: Math.random() * 0.5 + 0.1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
    colorClass: colorClasses[Math.floor(Math.random() * colorClasses.length)] ?? colorClasses[0]!,
  }))
}

export function FloatingParticles({
  className,
  count = 20,
  color = "mixed",
  size = "md",
}: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isClient = useIsClient()
  const [particles] = useState<Particle[]>(() => generateParticles(count, color, size))

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      aria-hidden="true"
    >
      {isClient &&
        particles.map((p) => (
          <div
            key={p.id}
            className={cn(
              "absolute rounded-full animate-float-slow",
              p.colorClass,
              `opacity-${Math.round(p.opacity * 100)}`
            )}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
    </div>
  )
}