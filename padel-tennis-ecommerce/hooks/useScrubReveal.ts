"use client"

import { useEffect, useRef } from "react"
import type { gsap as gsapType } from "gsap"

import { gsap, prefersReducedMotion } from "@/lib/gsap"

/**
 * Hook to attach a GSAP scroll-scrubbed reveal to a section.
 *
 * The build callback receives the section element (scope) and a timeline
 * whose progress is tied to scroll position with 1.5s of lerp smoothing.
 * Tweens use `ease: "none"` so the animation is linear with scroll.
 *
 * Usage:
 *   const ref = useScrubReveal((scope, tl) => {
 *     const cards = scope.querySelectorAll("[data-card]")
 *     gsap.set(cards, { y: 30, opacity: 0 })
 *     tl.to(cards, { y: 0, opacity: 1, stagger: 0.1, duration: 1 })
 *   })
 *
 * - The animation completes when the section's TOP reaches 25% of viewport,
 *   so even staggered tweens have time to finish while the section is in view.
 * - Honours prefers-reduced-motion: skips the animation (elements stay at
 *   their natural rendered state).
 */
export function useScrubReveal<T extends HTMLElement = HTMLElement>(
  build: (scope: T, tl: gsapType.core.Timeline) => void
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return
    if (prefersReducedMotion()) return

    const scope = ref.current
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        scrub: 1.5,
        trigger: scope,
        start: "top 85%",
        end: "top 25%",
      },
    })

    build(scope, tl)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
