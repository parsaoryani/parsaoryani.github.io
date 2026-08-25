"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Play, Pause } from "lucide-react"

interface ViewportVideoProps {
  src: string
  poster: string
  className?: string
  ariaLabel: string
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getReducedMotionServerSnapshot() {
  return false
}

export function ViewportVideo({ src, poster, className, ariaLabel }: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || reducedMotion) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [reducedMotion])

  function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`relative block w-full overflow-hidden group cursor-pointer ${className ?? ""}`}
      aria-label={`${ariaLabel}, click to play or pause`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        preload="metadata"
        controls={false}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-cover"
      >
        <track kind="captions" />
      </video>
      <div className="absolute inset-0 bg-void/0 group-hover:bg-void/20 transition-colors duration-300 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-void/60 backdrop-blur-sm border border-slate-600/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isPlaying ? <Pause size={14} className="text-fog" /> : <Play size={14} className="text-fog ml-0.5" />}
        </div>
      </div>
    </button>
  )
}
