import OptimizedImage from "@/components/OptimizedImage"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type Slide = {
  src: string
  alt: string
  priority?: boolean
}

const SLIDES: Slide[] = [
  {
    src: "/optimized/adidas_2026.webp",
    alt: "Metalbone Edición 2026 — Power of Nature",
    priority: true,
  },
  { src: "/optimized/adidas-banner.webp", alt: "Adidas" },
  { src: "/optimized/butterfly-banner.webp", alt: "Butterfly" },
  { src: "/optimized/dhs-banner.webp", alt: "DHS" },
  { src: "/optimized/wilson-banner.webp", alt: "Wilson" },
]

export default function PromoCarousel() {
  return (
    <section className="w-full bg-white" aria-label="Banners promocionales">
      <Carousel opts={{ align: "center", loop: true }} className="w-full">
        <CarouselContent className="-ml-0">
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.src} className="basis-full pl-0">
              <div className="relative flex h-[200px] w-full items-center justify-center overflow-hidden bg-white xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]">
                <OptimizedImage
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  className="h-full w-full"
                  style={{ objectFit: "contain" }}
                  priority={slide.priority}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 border-0 bg-white/85 text-brand-black shadow-md transition-all duration-200 hover:bg-white sm:left-4" />
        <CarouselNext className="right-2 border-0 bg-white/85 text-brand-black shadow-md transition-all duration-200 hover:bg-white sm:right-4" />
      </Carousel>
    </section>
  )
}
