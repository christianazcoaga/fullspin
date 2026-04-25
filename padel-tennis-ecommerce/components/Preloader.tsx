"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { gsap } from "gsap"

import Logo from "@/components/layout/Logo"

const FIRST_RENDER_HOLD_MS = 2200
const NAV_HOLD_MS = 900
const FADE_OUT_MS = 500

export default function Preloader() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const isFirstRender = useRef(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const logoWrapRef = useRef<HTMLDivElement>(null)
  const accentRef = useRef<HTMLSpanElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)

  const isAdmin = pathname?.startsWith("/admin")

  // Visibility / hold timing — same idea as before, just centralised.
  useEffect(() => {
    if (isAdmin) {
      setIsVisible(false)
      return
    }

    const hold = isFirstRender.current ? FIRST_RENDER_HOLD_MS : NAV_HOLD_MS
    isFirstRender.current = false

    setIsVisible(true)
    setIsFading(false)

    const timer = window.setTimeout(() => {
      setIsFading(true)
      window.setTimeout(() => setIsVisible(false), FADE_OUT_MS)
    }, hold)

    return () => window.clearTimeout(timer)
  }, [pathname, isAdmin])

  // GSAP entrance choreography.
  useEffect(() => {
    if (!isVisible || isAdmin) return
    if (!containerRef.current) return

    // Honour reduced-motion: skip the choreography and just present the
    // final state.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([logoWrapRef.current, captionRef.current, accentRef.current], {
          opacity: 1,
          scale: 1,
          y: 0,
          rotate: 0,
        })
        gsap.set("[data-preloader-logo] svg path", { opacity: 1, scale: 1 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // 1. Logo wrapper pops in with a small backspin (nods to "Full Spin")
      tl.fromTo(
        logoWrapRef.current,
        { scale: 0.55, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: "back.out(1.6)" }
      )

      // 2. Each glyph in the SVG staggers in (from invisible centred dots
      //    to full size) so the letters feel like they "land".
      tl.fromTo(
        "[data-preloader-logo] svg path",
        {
          opacity: 0,
          scale: 0,
          transformOrigin: "50% 50%",
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.045,
          ease: "back.out(2.4)",
        },
        "-=0.5"
      )

      // 3. Neon accent bar swipes in under the logo.
      tl.fromTo(
        accentRef.current,
        { scaleX: 0, opacity: 0, transformOrigin: "0% 50%" },
        { scaleX: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.25"
      )

      // 4. Caption gently floats up.
      tl.fromTo(
        captionRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.3"
      )

      // 5. Idle micro-bob keeps the mark "alive" while we wait.
      tl.to(
        logoWrapRef.current,
        {
          y: -4,
          duration: 1.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
        ">+0.05"
      )
    }, containerRef)

    return () => ctx.revert()
  }, [isVisible, isAdmin])

  if (!isVisible || isAdmin) return null

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-brand-blue-dark text-brand-cream transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      <div className="flex flex-col items-center gap-6">
        <div
          ref={logoWrapRef}
          data-preloader-logo
          className="relative flex flex-col items-center"
          style={{ willChange: "transform" }}
        >
          <Logo
            variant="stacked"
            color="light"
            className="h-24 w-auto sm:h-28"
          />
          <span
            ref={accentRef}
            aria-hidden="true"
            className="mt-4 h-1 w-32 rounded-full bg-brand-neon"
          />
        </div>
        <p
          ref={captionRef}
          className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-cream/70"
        >
          Equipamiento deportivo
        </p>
      </div>
    </div>
  )
}
