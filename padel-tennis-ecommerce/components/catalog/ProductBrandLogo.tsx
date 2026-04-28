import Image from "next/image"

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
  if (!marca) return null
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
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-brand-black/70">
      {marca}
    </span>
  )
}
