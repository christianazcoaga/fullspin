"use client"

import Image from "next/image"
import { useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  alt: string
  /** Optional ribbon shown over the main image (e.g. discount pill). */
  badge?: React.ReactNode
  /** Optional pill rendered in the top-right of the main image (e.g. "Envío gratis"). */
  topRightPill?: React.ReactNode
}

const ZOOM_FACTOR = 2.2 // how much larger the zoomed image is than the lens area

/**
 * PDP gallery: main image + thumbnail strip. The main image supports
 * press-and-hold area-zoom: press the image (mouse button or finger), and
 * while held the zoom lens follows the pointer; release to exit.
 *
 * `images` is treated as a list (max 5). The first item is the initial
 * selection. Empty list falls back to a placeholder.
 */
export default function ProductGallery({
  images,
  alt,
  badge,
  topRightPill,
}: ProductGalleryProps) {
  const list = images.length > 0 ? images : ["/placeholder.svg"]
  const [activeIdx, setActiveIdx] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const pressingRef = useRef(false)
  const frameRef = useRef<HTMLDivElement>(null)

  const active = list[Math.min(activeIdx, list.length - 1)]

  const positionFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!frameRef.current) return null
    const rect = frameRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore non-primary mouse buttons (right-click, middle-click).
    if (e.pointerType === "mouse" && e.button !== 0) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    pressingRef.current = true
    const pos = positionFromEvent(e)
    if (pos) setZoom(pos)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pressingRef.current) return
    const pos = positionFromEvent(e)
    if (pos) setZoom(pos)
  }

  const releaseZoom = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pressingRef.current) return
    pressingRef.current = false
    setZoom(null)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={frameRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={releaseZoom}
        onPointerCancel={releaseZoom}
        onPointerLeave={releaseZoom}
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-2xl border border-brand-black/10 bg-white",
          // touch-none keeps the page from scrolling while the user is
          // dragging on the image to move the zoom lens.
          "touch-none select-none",
          zoom ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
        aria-label="Imagen del producto. Mantené presionado para hacer zoom."
      >
        {badge && <div className="absolute left-4 top-4 z-10">{badge}</div>}
        {topRightPill && (
          <div className="absolute right-4 top-4 z-10">{topRightPill}</div>
        )}

        <Image
          src={active}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 90vw"
          priority
          draggable={false}
          className={cn(
            "object-contain p-8 transition-transform duration-150 ease-out",
            zoom && "p-0"
          )}
          style={
            zoom
              ? {
                  transform: `scale(${ZOOM_FACTOR})`,
                  transformOrigin: `${zoom.x}% ${zoom.y}%`,
                }
              : undefined
          }
        />
      </div>

      {list.length > 1 && (
        <ul className="flex flex-wrap gap-2" role="tablist" aria-label="Galería">
          {list.map((url, i) => (
            <li key={`${url}-${i}`}>
              <button
                type="button"
                role="tab"
                aria-selected={i === activeIdx}
                aria-label={`Ver imagen ${i + 1}`}
                onClick={() => {
                  setActiveIdx(i)
                  pressingRef.current = false
                  setZoom(null)
                }}
                className={cn(
                  "relative aspect-square w-16 overflow-hidden rounded-md border bg-white transition-colors sm:w-20",
                  i === activeIdx
                    ? "border-brand-blue-dark ring-2 ring-brand-blue-dark/20"
                    : "border-brand-black/10 hover:border-brand-black/30"
                )}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
