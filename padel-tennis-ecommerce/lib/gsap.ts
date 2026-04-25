// Single GSAP entry point so plugins get registered exactly once,
// regardless of how many components import from it.

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin)
}

export { gsap, ScrollTrigger, ScrollSmoother, DrawSVGPlugin }

/** True when the user has opted out of motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
