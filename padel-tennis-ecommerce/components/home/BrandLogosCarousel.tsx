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
import {
  BRAND_SPORT_LABELS,
  type Brand,
  type BrandSport,
} from "@/lib/brands"

interface BrandLogosCarouselProps {
  /** All brands ordered by sport then display_order, fetched server-side. */
  brands: Brand[]
}

// Width/height below match the real source aspect ratio of each WebP
// (verified against /public/optimized/*-logo.webp on 2026-04-25):
//   butterfly 1.55, dhs 1.00, sanwei 5.46, adidas 1.33, wilson 1.50, head 1.78.
type LegacyLogo = { src: string; alt: string; width: number; height: number }
type LegacySlide = { sport: BrandSport; logos: LegacyLogo[] }

const FALLBACK_SLIDES: LegacySlide[] = [
  {
    sport: "tenis-mesa",
    logos: [
      { src: "/optimized/butterfly-logo.webp", alt: "Butterfly", width: 155, height: 100 },
      { src: "/optimized/dhs-logo.webp", alt: "DHS", width: 100, height: 100 },
      { src: "/optimized/sanwei-logo.webp", alt: "Sanwei", width: 546, height: 100 },
    ],
  },
  {
    sport: "padel",
    logos: [
      { src: "/optimized/adidas-logo.webp", alt: "Adidas", width: 133, height: 100 },
      { src: "/optimized/wilson-logo.webp", alt: "Wilson", width: 150, height: 100 },
    ],
  },
  {
    sport: "tenis",
    logos: [
      { src: "/optimized/wilson-logo.webp", alt: "Wilson", width: 150, height: 100 },
      { src: "/optimized/head-logo.webp", alt: "Head", width: 178, height: 100 },
    ],
  },
]

const AUTOPLAY_INTERVAL_MS = 4000

export default function BrandLogosCarousel({ brands }: BrandLogosCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [paused, setPaused] = useState(false)

  // Group DB brands by sport, preserving sport order and per-brand display_order.
  const grouped: { sport: BrandSport; logos: { src: string; alt: string }[] }[] =
    (["padel", "tenis", "tenis-mesa"] as BrandSport[])
      .map((sport) => ({
        sport,
        logos: brands
          .filter((b) => b.sport === sport && b.logo_url)
          .map((b) => ({ src: b.logo_url as string, alt: b.name })),
      }))
      .filter((s) => s.logos.length > 0)

  // If DB has no brands yet, fall back to the legacy hardcoded set so the
  // home doesn't render an empty section.
  const useDb = grouped.length > 0

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
      aria-labelledby="brand-logos-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="brand-logos-heading"
          className="mb-10 text-balance text-center text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight text-brand-black sm:mb-14"
        >
          Marcas que Trabajamos
        </h2>
        <Carousel
          opts={{ align: "center", loop: true }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {useDb
              ? grouped.map((slide) => (
                  <CarouselItem key={slide.sport}>
                    <div className="flex flex-col items-center gap-10 py-6 sm:gap-14">
                      <h3 className="text-xl font-bold uppercase tracking-widest text-brand-black/80 sm:text-2xl">
                        {BRAND_SPORT_LABELS[slide.sport]}
                      </h3>
                      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 sm:gap-x-20 lg:gap-x-28">
                        {slide.logos.map((logo) => (
                          <div
                            key={`${slide.sport}-${logo.alt}-${logo.src}`}
                            // Fixed-height slot caps the visual weight of
                            // each logo. The plain <img> uses the file's
                            // natural aspect ratio (next/image with
                            // hard-coded width/height was distorting wide
                            // wordmarks like Sanwei).
                            className="flex h-20 items-center justify-center sm:h-24 lg:h-28"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={logo.src}
                              alt={logo.alt}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-auto max-w-[160px] object-contain grayscale opacity-70 transition-all duration-200 hover:opacity-100 hover:grayscale-0 sm:max-w-[200px] lg:max-w-[240px]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CarouselItem>
                ))
              : FALLBACK_SLIDES.map((slide) => (
                  <CarouselItem key={slide.sport}>
                    <div className="flex flex-col items-center gap-10 py-6 sm:gap-14">
                      <h3 className="text-xl font-bold uppercase tracking-widest text-brand-black/80 sm:text-2xl">
                        {BRAND_SPORT_LABELS[slide.sport]}
                      </h3>
                      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 sm:gap-x-20 lg:gap-x-28">
                        {slide.logos.map((logo) => {
                          const heightClass =
                            logo.alt === "Sanwei"
                              ? "h-12 sm:h-14 lg:h-16"
                              : "h-20 sm:h-24 lg:h-28"
                          return (
                            <div
                              key={`${slide.sport}-${logo.alt}`}
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
