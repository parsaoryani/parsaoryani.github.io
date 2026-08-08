"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils/cn"

interface MouseGlowProps {
  children: React.ReactNode
  className?: string
  glowColor?: "cyan" | "indigo" | "emerald" | "amber"
  intensity?: number
}

export function MouseGlow({
  children,
  className,
  glowColor = "cyan",
  intensity = 0.08,
}: MouseGlowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const glowColors = {
    cyan: `rgba(56, 225, 196, ${intensity})`,
    indigo: `rgba(124, 108, 255, ${intensity})`,
    emerald: `rgba(63, 185, 80, ${intensity})`,
    amber: `rgba(210, 153, 34, ${intensity})`,
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePos({ x, y })
    }
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 50, y: 50 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative overflow-hidden", className)}
      style={{
        "--mouse-x": `${mousePos.x}%`,
        "--mouse-y": `${mousePos.y}%`,
        "--glow-color": glowColors[glowColor],
      } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--glow-color), transparent 50%)`,
        }}
      />
      {children}
    </div>
  )
}