"use client"

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function PremiumEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const pathname = usePathname()

  useEffect(() => {
    // Only show on desktop environments
    if (window.innerWidth < 768) return

    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smooth, non-blocking updates
      requestAnimationFrame(() => {
        setMousePos({
          x: e.clientX,
          y: e.clientY
        })
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // If the user prefers reduced motion, disable the effect
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  if (prefersReducedMotion) return null

  // Don't show the premium effect inside the dashboards/admin panels to keep them clean for work
  const isDashboardOrAdmin = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/publisher")
  if (isDashboardOrAdmin) return null

  return (
    <>
      <div 
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        style={{ opacity: 0.6 }}
      >
        <div 
          className="absolute rounded-full mix-blend-multiply filter blur-[100px] transition-transform duration-1000 ease-out dark:mix-blend-lighten pointer-events-none w-[600px] h-[600px]"
          style={{
            background: "radial-gradient(circle, rgba(129, 140, 248, 0.4) 0%, rgba(167, 139, 250, 0.2) 30%, rgba(244, 114, 182, 0) 70%)",
            transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
          }}
        />
        <div 
          className="absolute rounded-full mix-blend-multiply filter blur-[80px] transition-transform duration-[1500ms] ease-out dark:mix-blend-lighten pointer-events-none w-[400px] h-[400px]"
          style={{
            background: "radial-gradient(circle, rgba(232, 121, 249, 0.4) 0%, rgba(96, 165, 250, 0.2) 30%, rgba(244, 114, 182, 0) 70%)",
            transform: `translate(${mousePos.x - 200 + 40}px, ${mousePos.y - 200 + 40}px)`,
          }}
        />
      </div>
      
      {/* Dynamic Grid Background Overlay to give it structure */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
    </>
  )
}
