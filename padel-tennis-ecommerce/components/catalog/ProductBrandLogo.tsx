"use client"

import Image from "next/image"

import { useBrandLogo } from "@/components/layout/BrandLogosProvider"
import { BRAND_LOGOS } from "@/lib/catalog"

interface ProductBrandLogoProps {
  marca: string | null | undefined
  /** Maximum logo height in pixels. Defaults to 24. */
  maxHeight?: number
  className?: string
}

export default function ProductBrandLogo({
  marca,
  maxHeight = 24,
  className,
}: ProductBrandLogoProps) {
  const dbLogoUrl = useBrandLogo(marca)

  if (!marca) return null

  // 1. DB-managed logo (admin-uploaded). Preferred — reflects current brand
  // catalog without code changes. Plain <img> because we don't know the
  // file's natural aspect ratio at build time.
  if (dbLogoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={dbLogoUrl}
        alt={marca}
        loading="lazy"
        decoding="async"
        style={{ maxHeight, width: "auto" }}
        className={className}
      />
    )
  }

  // 2. Static registry (legacy WebPs in /public/optimized/).
  const logo = BRAND_LOGOS[marca]
  if (logo) {
    return (
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        style={{ maxHeight, width: "auto" }}
        className={className}
        unoptimized
      />
    )
  }

  // 3. Text fallback.
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-brand-black/70">
      {marca}
    </span>
  )
}
