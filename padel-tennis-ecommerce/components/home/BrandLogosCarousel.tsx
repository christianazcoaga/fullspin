"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

type BrandLogo = {
  src: string
  alt: string
  /** Intrinsic dimensions matching the real source aspect ratio. */
  width: number
  height: number
}

type LogoSlide = {
  title: string
  logos: BrandLogo[]
}

// Width/height below match the real source aspect ratio of each WebP
// (verified against /public/optimized/*-logo.webp on 2026-04-25):
//   butterfly 1.55, dhs 1.00, sanwei 5.46, adidas 1.33, wilson 1.50, head 1.78.
// They're scaled to a base height of 100 so next/image picks a sensible
// srcSet; the CSS height (h-20 / h-24 / h-28) drives the rendered size.
const SLIDES: LogoSlide[] = [
  {
    title: "Tenis de Mesa",
    logos: [
      { src: "/optimized/butterfly-logo.webp", alt: "Butterfly", width: 155, height: 100 },
      { src: "/optimized/dhs-logo.webp", alt: "DHS", width: 100, height: 100 },
      { src: "/optimized/sanwei-logo.webp", alt: "Sanwei", width: 546, height: 100 },
    ],
  },
  {
    title: "Padel",
    logos: [
      { src: "/optimized/adidas-logo.webp", alt: "Adidas", width: 133, height: 100 },
      { src: "/optimized/wilson-logo.webp", alt: "Wilson", width: 150, height: 100 },
    ],
  },
  {
    title: "Tenis",
    logos: [
      { src: "/optimized/wilson-logo.webp", alt: "Wilson", width: 150, height: 100 },
      { src: "/optimized/head-logo.webp", alt: "Head", width: 178, height: 100 },
    ],
  },
]

const AUTOPLAY_INTERVAL_MS = 4000

export default function BrandLogosCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!api) return
    if (paused) return

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    const id = window.setInterval(() => {
      api.scrollNext()
    }, AUTOPLAY_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [api, paused])

  return (
    <section
      className="bg-white py-20 lg:py-24"
      aria-label="Marcas que vendemos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Carousel
          opts={{ align: "center", loop: true }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {SLIDES.map((slide) => (
              <CarouselItem key={slide.title}>
                <div className="flex flex-col items-center gap-10 py-6 sm:gap-14">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-brand-black/80 sm:text-2xl">
                    {slide.title}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 sm:gap-x-20 lg:gap-x-28">
                    {slide.logos.map((logo) => {
                      // Sanwei is a very wide horizontal wordmark (5.46:1).
                      // Scale it down a touch so it sits at the same visual
                      // weight as the more square marks.
                      const heightClass =
                        logo.alt === "Sanwei"
                          ? "h-12 sm:h-14 lg:h-16"
                          : "h-20 sm:h-24 lg:h-28"
                      return (
                        <div
                          key={`${slide.title}-${logo.alt}`}
                          className="flex items-center justify-center"
                        >
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={logo.width}
                            height={logo.height}
                            sizes="(max-width: 640px) 30vw, (max-width: 1024px) 18vw, 220px"
                            className={`w-auto object-contain grayscale opacity-70 transition-all duration-200 hover:opacity-100 hover:grayscale-0 ${heightClass}`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 border-0 bg-brand-cream text-brand-black shadow-md transition-all duration-200 hover:bg-brand-cream sm:-left-4" />
          <CarouselNext className="right-0 border-0 bg-brand-cream text-brand-black shadow-md transition-all duration-200 hover:bg-brand-cream sm:-right-4" />
        </Carousel>
      </div>
    </section>
  )
}
