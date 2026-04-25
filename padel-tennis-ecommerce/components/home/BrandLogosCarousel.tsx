"use client"

import { useEffect, useState } from "react"

import OptimizedImage from "@/components/OptimizedImage"
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
  width: number
  height: number
}

type LogoSlide = {
  title: string
  logos: BrandLogo[]
}

const SLIDES: LogoSlide[] = [
  {
    title: "Tenis de Mesa",
    logos: [
      { src: "/optimized/butterfly-logo.webp", alt: "Butterfly", width: 120, height: 80 },
      { src: "/optimized/dhs-logo.webp", alt: "DHS", width: 100, height: 80 },
      { src: "/optimized/sanwei-logo.webp", alt: "Sanwei", width: 100, height: 80 },
    ],
  },
  {
    title: "Padel",
    logos: [
      { src: "/optimized/adidas-logo.webp", alt: "Adidas", width: 80, height: 80 },
      { src: "/optimized/wilson-logo.webp", alt: "Wilson", width: 100, height: 80 },
    ],
  },
  {
    title: "Tenis",
    logos: [
      { src: "/optimized/wilson-logo.webp", alt: "Wilson", width: 100, height: 80 },
      { src: "/optimized/head-logo.webp", alt: "Head", width: 100, height: 80 },
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

    // Honour reduced-motion: do not auto-advance when the user opted out.
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
      className="bg-white py-16"
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
                <div className="flex flex-col items-center gap-6 py-6">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-black/60">
                    {slide.title}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
                    {slide.logos.map((logo) => (
                      <div
                        key={`${slide.title}-${logo.alt}`}
                        className="relative grayscale opacity-70 transition-all duration-200 hover:opacity-100 hover:grayscale-0"
                      >
                        <OptimizedImage
                          src={logo.src}
                          alt={logo.alt}
                          width={logo.width}
                          height={logo.height}
                          className="h-12 w-auto object-contain sm:h-16"
                        />
                      </div>
                    ))}
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
